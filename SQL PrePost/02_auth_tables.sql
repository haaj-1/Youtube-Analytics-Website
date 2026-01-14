-- Auth Tables
CREATE TABLE auth.users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255),
    auth_provider NVARCHAR(50) NOT NULL, -- 'local' or 'google'
    created_at DATETIME2 DEFAULT GETDATE(),
    last_login_at DATETIME2
);
GO

CREATE TABLE auth.refresh_tokens (
    token_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    token_hash NVARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    revoked_at DATETIME2 NULL
);
GO