@echo off
echo Starting PostgreSQL...
net start postgresql-x64-17
if %errorlevel% neq 0 (
    echo Failed to start PostgreSQL service. Trying alternative method...
    "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" start -D "C:\Program Files\PostgreSQL\17\data"
)
echo PostgreSQL should now be running on port 5432
pause