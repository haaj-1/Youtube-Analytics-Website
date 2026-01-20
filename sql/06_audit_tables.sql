/*****************************************************************************************
SECTION 6 — AUDIT & MONITORING
------------------------------------------------------------------------------------------
Purpose:
- Support rate limiting
- Log API requests
- Track important security & system events
*****************************************************************************************/

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
