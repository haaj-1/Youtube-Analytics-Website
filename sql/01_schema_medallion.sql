/*****************************************************************************************
PROJECT: PrePost Analytics
DESCRIPTION:
PrePost Analytics is a data analytics and machine learning platform designed to help
Instagram creators predict post engagement BEFORE publishing content.

This database follows a MEDALLION ARCHITECTURE:

- BRONZE  → Raw, immutable Instagram API ingestion
- SILVER  → Cleaned, aggregated, analytics-ready data
- GOLD    → ML features, predictions, and insights

The system is batch-based, privacy-safe, and uses only first-party Instagram data.
This schema supports analytics dashboards, ML training, and prediction APIs.

ARCHITECTURE: Medallion (Bronze / Silver / Gold)
DATABASE: SQL Server
*****************************************************************************************/


/*****************************************************************************************
SECTION 1 — DATABASE & SCHEMA CREATION
------------------------------------------------------------------------------------------
Each schema represents a logical responsibility:
- auth   : authentication & user identity
- bronze : raw ingestion layer (source)
- silver : cleaned analytics layer
- gold   : ML features, predictions, insights
- audit  : logging, monitoring, security events
*****************************************************************************************/

-- Database Creation
CREATE DATABASE PrePostAnalytics;
GO

-- Switch context to the new database
USE PrePostAnalytics;
GO
  
CREATE SCHEMA auth;
GO

CREATE SCHEMA bronze;
GO

CREATE SCHEMA silver;
GO

CREATE SCHEMA gold;
GO

CREATE SCHEMA audit;
GO

