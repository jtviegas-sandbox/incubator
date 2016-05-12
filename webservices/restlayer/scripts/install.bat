@echo off

rem #install dataservices for it is a dependency, it comprises domainmodel as well
set DATA_SERVICES_BUILD_DIR=C:\Users\joao\Documents\i\dev\wxsp\labs\dataservices
set RESTLAYER_BUILD_DIR=C:\Users\joao\Documents\i\dev\wxsp\labs\restlayer
set PWD=%cd%
set DELAY=3


echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> restlayer install started..."
sleep %DELAY%

echo "################ cleaning restlayer 	################"
sleep %DELAY%
call mvn clean
echo "################ forking to load up wildfly 	################"
sleep %DELAY%
call start /B mvn wildfly:run -DskipTests=true -Djboss-as.home=C:\dev\servers\wildfly-8.0.0.CR1

echo "################ calling dataservices install ################"
sleep %DELAY%
cd %DATA_SERVICES_BUILD_DIR%
call .\install.bat &GOTO LOCAL_INSTALL

:LOCAL_INSTALL
cd %RESTLAYER_BUILD_DIR%
echo "################ starting mongodb 			################"
sleep %DELAY%
start %SCRIPTS%\start_mongodb.bat
echo "################ waiting for mongodb 			################"
sleep 8

:GET_CMD_FORK_PID
FOR /F %%T IN ('Wmic process where^(Name^="mongod.exe"^)get PArentProcessId^|more +1') DO (
SET /A cmdPid=%%T) &GOTO GET_MONGO_PID 
:GET_MONGO_PID
FOR /F %%T IN ('Wmic process where^(Name^="mongod.exe"^)get ProcessId^|more +1') DO (
SET /A mongoPid=%%T) &GOTO NEXT_STAGE

:NEXT_STAGE
echo "################ packaging restlayer 			################""
sleep %DELAY%
call mvn package -DskipTests=true

echo "################ waiting for wildfly 			################"
sleep 30
echo "################ deploying restlayer 			################"
sleep %DELAY%
call mvn wildfly:deploy -DskipTests=true
echo "################ testing restlayer 			################"
sleep %DELAY%
call mvn test
echo "################ undeploying restlayer 		################"
sleep %DELAY%
call mvn wildfly:undeploy -DskipTests=true
echo "################ shuting up wildfly			################"
sleep %DELAY%
call mvn wildfly:shutdown -Djboss-as.home=C:\dev\servers\wildfly-8.0.0.CR1

taskkill /F /PID %mongoPid%
taskkill /F /PID %cmdPid%

echo "<<<<<<<<<<<<<<<<<<<<<<<< ...restlayer install finished."