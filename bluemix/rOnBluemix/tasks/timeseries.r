



source('/app/tasks/lib.R')

db_user<-Sys.getenv('MONGO_USER')
db_pass<-Sys.getenv('MONGO_PASS')
db_host<-Sys.getenv('MONGO_HOST')
db_port<-Sys.getenv('MONGO_PORT')
db_name<-Sys.getenv('MONGO_DBNAME')
INITIAL_TS_EPOCH <- 1088604240
data_collection<-"timedata"
MEAN<-100.0
SD<-50.0
POS_1SD<-100+SD
POS_2SD<-100+(2*SD)
POS_3SD<-100+(3*SD)
NEG_1SD<-100-SD
NEG_2SD<-100-(2*SD)
NEG_3SD<-100-(3*SD)


if(length(find.package("rJava",quiet=TRUE))==0){
  install.packages("rJava")
}
if(length(find.package("RMongo",quiet=TRUE))==0){
  install.packages("RMongo")
}
library(rJava)
library(RMongo)

createSingleData<-function(){
  print(Sys.time())
  connect(db_host, db_port, db_user, db_pass, db_name)
  ts_epoch<-as.integer(Sys.time())
  ts_epoch <- ts_epoch + as.integer(abs(rnorm(1,30,5.0)))
  df<-createRandomSkinnyRecord('metric',ts_epoch, MEAN, SD)
  
  json_obj<-df2json(df)
  dbInsertDocument(getConnection(), data_collection, json_obj)  
  disconnect()
  print(Sys.time())
}

getData<-function(){
  print(Sys.time())
  connect(db_host, db_port, db_user, db_pass, db_name)
  output<-dbGetQuery(getConnection(), data_collection, '{}')
  disconnect()
  print(Sys.time())
  return(output)
}

cleanData<-function(){
  print(Sys.time())
  connect(db_host, db_port, db_user, db_pass, db_name)
  output<-dbRemoveQuery(getConnection(), data_collection, '{}')
  disconnect()
  print(Sys.time())
  return(output)
}


createSingleData()
print(getData())
