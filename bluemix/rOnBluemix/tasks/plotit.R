source('~/workspace/github/bluemix/rOnBluemix/tasks/lib.R')

if(length(find.package("reshape",quiet=TRUE))==0){
  install.packages("reshape")
}
if(length(find.package("lattice",quiet=TRUE))==0){
  install.packages("lattice")
}
if(length(find.package("rJava",quiet=TRUE))==0){
  install.packages("rJava")
}
if(length(find.package("RMongo",quiet=TRUE))==0){
  install.packages("RMongo")
}
library(rJava)
library(RMongo)

library(reshape)
library(lattice)



db_user<-'IbmCloud_okgvbec3_ffdm3epn_kla105ek'
db_pass<-'g6E-tOSN70JfzZbUSg5iMBiXGWUzPcTE'
db_host<-'ds055200.mongolab.com'
db_port<-55200
db_name<-'IbmCloud_okgvbec3_ffdm3epn'
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
plotSkinnySeries<-function(d, title, plotLimits=NULL){
  
  if(0 == length(plotLimits)){
    min_ts<-min(d[,1])
    max_ts<-max(d[,1])
  }
  else {
    min_ts<-plotLimits[1]
    max_ts<-plotLimits[2]
  }
  
  xyplot(d[,3] ~ d[,1], data = d, groups = d[,2],type='l',
         main=title,
         xlab="timestamp", ylab = "value",
         auto.key = list(space = 'right', points = FALSE, lines = TRUE)
         ,scales = list(
           x = list( draw=TRUE , limits=c(min_ts,max_ts))
         )
  )
}

plotData<-function(){
  d<-getData()
  d2<-cbind(d[,1],d[3:4])
  plotSkinnySeries(d2, 'ronbluemix')
}
histData<-function(){
  d<-getData()
  d2<-cbind(d[,1],d[3:4])
  hist(d2[,3],12)
}