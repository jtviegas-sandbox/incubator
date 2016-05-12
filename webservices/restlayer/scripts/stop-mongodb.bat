@echo off

call %~dp0%/environment.bat

for /f %%a in (%MONGOPIDFILE%) do set _PID=%%a
Taskkill /PID %_PID% /F
