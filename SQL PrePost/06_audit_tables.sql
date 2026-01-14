-- Audit / Security Tables
CREATE TABLE audit.audit_logs (
    audit_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    action_type NVARCHAR(50), -- login, data_pull, prediction_request
    action_details NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

CREATE TABLE audit.api_request_logs (
    request_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    endpoint NVARCHAR(255),
    status_code INT,
    request_time DATETIME2 DEFAULT GETDATE()
);
GO
