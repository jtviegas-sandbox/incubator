@echo off

set APPNAME=aprestos

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> undeploying %APPNAME% in openshift..."

set EAR_FILE=%APPNAME%-0.0.1-SNAPSHOT.ear
set DEPLOYED_MARKER_FILE=%EAR_FILE%.deployed

set OPENSHIFT_CONNECTION_INFO=53792c975973cadbd0000650@site-aprestos.rhcloud.com
set OPENSHIFT_DEPLOYMENT_FOLDER=~/wildfly/standalone/deployments

set SSH_COMMAND=ssh %OPENSHIFT_CONNECTION_INFO% rm -f %OPENSHIFT_DEPLOYMENT_FOLDER%/%EAR_FILE%*
set errorlevel=
call %SSH_COMMAND%
if "%errorlevel%"=="0" goto SUCCESS
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ... something's wrong undeploying %APPNAME% in openshift!"
goto END

:SUCCESS
echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ... undeployed %APPNAME% in openshift!"

:END
cd %PWD%
sleep 10