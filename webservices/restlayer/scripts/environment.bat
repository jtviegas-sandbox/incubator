@echo off

set SCRIPT_PATH=%~dp0%
set MONGOD=%MONGO_HOME%\bin\mongod.exe
set DB_PATH=%DBDATA_HOME%\mongodb 
set MONGOPIDFILE=%SCRIPT_PATH%/.MONGOPID
