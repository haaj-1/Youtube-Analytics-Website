from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from app.models.schemas import UserCreate, UserResponse
from app.models.database_models import User
from app.db.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.audit_logger import log_audit_event
from google.oauth2 import id_token
from google.auth.transport import requests
from app.core.config import settings

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

@router.get("/test-hash")
async def test_hash():
    """Test endpoint to verify hashing is working"""
    import hashlib
    import bcrypt
    pwd = "12catcat"
    prehashed = hashlib.sha256(pwd.encode()).hexdigest().encode()
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(prehashed, salt)
    return {
        "password": pwd,
        "prehashed_length": len(prehashed),
        "prehashed": prehashed.decode(),
        "hash_success": True,
        "hash_preview": hashed.decode()[:50]
    }

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            full_name=user.full_name,
            password_hash=hashed_password,
            auth_provider="local"
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Log registration
        log_audit_event(db_user.user_id, "register", {
            "email": db_user.email,
            "auth_provider": "local"
        })
        
        return {
            "id": db_user.user_id,
            "email": db_user.email,
            "youtube_channel_id": user.youtube_channel_id,
            "created_at": db_user.created_at
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """User login"""
    try:
        # Find user
        user = db.query(User).filter(User.email == credentials.email).first()
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Update last login
        user.last_login_at = datetime.utcnow()
        db.commit()
        
        # Log login event
        log_audit_event(user.user_id, "login", {
            "email": user.email,
            "auth_provider": "local"
        })
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.user_id), "email": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.user_id,
                "email": user.email
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/google")
async def google_auth(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Google OAuth authentication"""
    try:
        print(f"\n=== GOOGLE AUTH DEBUG ===")
        print(f"Token received: {auth_request.token[:50]}...")
        print(f"Client ID: {settings.GOOGLE_CLIENT_ID}")
        
        # Verify Google token
        try:
            idinfo = id_token.verify_oauth2_token(
                auth_request.token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            print(f"Token verified successfully")
            print(f"Email: {idinfo.get('email')}")
        except Exception as verify_error:
            print(f"Token verification failed: {str(verify_error)}")
            raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(verify_error)}")
        
        email = idinfo['email']
        full_name = idinfo.get('name', '')
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            user = User(
                email=email,
                full_name=full_name,
                auth_provider="google",
                password_hash=""  # No password for Google users
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"New user created: {email}")
            
            # Log registration
            log_audit_event(user.user_id, "register", {
                "email": email,
                "auth_provider": "google"
            })
        else:
            print(f"Existing user found: {email}")
        
        # Update last login
        user.last_login_at = datetime.utcnow()
        db.commit()
        
        # Log login event
        log_audit_event(user.user_id, "login", {
            "email": email,
            "auth_provider": "google"
        })
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.user_id), "email": user.email})
        
        print(f"Access token created successfully")
        print(f"==========================\n")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.user_id,
                "email": user.email,
                "name": user.full_name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Google auth error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))