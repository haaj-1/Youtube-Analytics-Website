/*****************************************************************************************
SECTION 2 — AUTHENTICATION & USER MANAGEMENT (auth)
------------------------------------------------------------------------------------------
Purpose:
- Manage application users
- Support JWT authentication and refresh token rotation
- Owns all downstream YouTube data
*****************************************************************************************/

-- Stores application users
CREATE TABLE auth.users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255),
    auth_provider NVARCHAR(50) NOT NULL, -- local / google
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    last_login_at DATETIME2
);
GO

-- Stores refresh tokens for JWT rotation
CREATE TABLE auth.refresh_tokens (
    token_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash NVARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    revoked_at DATETIME2,
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES auth.users(user_id)
);
GO

