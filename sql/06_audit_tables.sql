USE prepost_analytics;
GO

-- Create audit schema if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'audit')
    EXEC('CREATE SCHEMA audit');
GO

/*****************************************************************************************
SECTION 6 — AUDIT & MONITORING
------------------------------------------------------------------------------------------
Purpose:
- Support rate limiting
- Log API requests
- Track important security & system events
*****************************************************************************************/

-- Drop existing tables if they exist
IF OBJECT_ID('audit.audit_logs', 'U') IS NOT NULL DROP TABLE audit.audit_logs;
IF OBJECT_ID('audit.api_request_logs', 'U') IS NOT NULL DROP TABLE audit.api_request_logs;
GO

-- API request logs for monitoring and abuse prevention
CREATE TABLE audit.api_request_logs (
    request_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    endpoint NVARCHAR(100),
    status_code INT,
    request_time DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- General audit logs
CREATE TABLE audit.audit_logs (
    audit_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    action_type NVARCHAR(50), -- login, data_pull, prediction
    action_details NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT SYSDATETIME()
);
GO
