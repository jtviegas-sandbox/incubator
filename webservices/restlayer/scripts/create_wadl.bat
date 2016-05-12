@echo off

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> wadl creation started..."

mvn compile com.sun.jersey.contribs:maven-wadl-plugin:generate

echo "<<<<<<<<<<<<<<<<<<<<<<<< ...wadl creation finished."