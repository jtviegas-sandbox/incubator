@echo off

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> deploying weblabs to openshift..."

set APPNAME=aprestos

set EAR_FILE=%APPNAME%-0.0.1-SNAPSHOT.ear
set EAR_PATH=C:\Users\joao\Documents\i\dev\wxsp\labs\aprestos\target
set PWD=%cd%

set OPENSHIFT_CONNECTION_INFO=53792c975973cadbd0000650@site-aprestos.rhcloud.com
set OPENSHIFT_DEPLOYMENT_FOLDER=~/wildfly/standalone/deployments
set SCP_COMMAND=scp %EAR_FILE% %OPENSHIFT_CONNECTION_INFO%:%OPENSHIFT_DEPLOYMENT_FOLDER%
set APP_RESTART_COMMAND=rhc app restart -a site

cd %EAR_PATH%
set errorlevel=
call %SCP_COMMAND%
if "%errorlevel%"=="0" goto COPY_SUCCESS
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ... something's wrong deploying %APPNAME% to openshift!"
goto END

:COPY_SUCCESS
cd %PWD%
call %APP_RESTART_COMMAND%
if "%errorlevel%"=="0" goto SUCCESS
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ... couldn't restart application after copying it successfully!"
goto END

:SUCCESS
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ... deployed %APPNAME% to openshift successfully!"

:END
sleep 10