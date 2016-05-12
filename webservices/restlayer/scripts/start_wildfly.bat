@echo off

set DELAY=2
set WILDFLY_HOME=C:\dev\servers\wildfly-8.0.0.CR1
rem -Djboss-as.home=%WILDFLY_HOME%

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> starting mongodb & wildfly..."
timeout %DELAY%

echo "################ starting mongodb 			################"
timeout %DELAY%
start /B %SCRIPTS%\start_mongodb.bat

echo "################ waiting for mongodb 			################"
timeout 10

echo "################ setting mongodb PIDs			################"
timeout %DELAY%
:GET_CMD_FORK_PID
FOR /F %%T IN ('Wmic process where^(Name^="mongod.exe"^)get PArentProcessId^|more +1') DO (
SET /A cmdPid=%%T) &GOTO GET_MONGO_PID 
:GET_MONGO_PID
FOR /F %%T IN ('Wmic process where^(Name^="mongod.exe"^)get ProcessId^|more +1') DO (
SET /A mongoPid=%%T) &GOTO NEXT_STAGE
:NEXT_STAGE


echo "################ starting wildfly 			################"
timeout %DELAY%
start /B mvn wildfly:run -DskipTests=true


echo "<<<<<<<<<<<<<<<<<<<<<<<< ...mongodb & wildfly started."
