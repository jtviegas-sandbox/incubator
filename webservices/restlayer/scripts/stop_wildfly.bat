@echo off

set DELAY=2
set WILDFLY_HOME=C:\dev\servers\wildfly-8.0.0.CR1
rem -Djboss-as.home=%WILDFLY_HOME%
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> stopping wildfly & mongodb ..."
rem timeout %DELAY%

echo "################ shuting up wildfly			################"
rem timeout %DELAY%
call start /B mvn wildfly:shutdown

echo "################ shuting up mongodb			################"
rem timeout %DELAY%
taskkill /F /PID %mongoPid%
taskkill /F /PID %cmdPid%


echo "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ...wildfly & mongodb stopped."






