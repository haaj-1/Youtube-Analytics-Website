"""
Audit Logger
Helper functions to log user actions to audit.audit_logs table
"""
from app.db.database import SessionLocal
from app.models.database_models import AuditLog
import json

def log_audit_event(user_id: int, action_type: str, action_details: dict = None):
    """
    Log an audit event to the database
    
    Args:
        user_id: ID of the user performing the action
        action_type: Type of action (login, prediction, data_pull, etc.)
        action_details: Dictionary of additional details about the action
    """
    try:
        db = SessionLocal()
        
        # Convert details to JSON string
        details_str = json.dumps(action_details) if action_details else None
        
        audit_entry = AuditLog(
            user_id=user_id,
            action_type=action_type,
            action_details=details_str
        )
        
        db.add(audit_entry)
        db.commit()
        db.close()
        
        print(f"✓ Audit log: User {user_id} - {action_type}")
    except Exception as e:
        print(f"Failed to log audit event: {e}")
