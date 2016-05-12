oDB_CONNECTION<-NULL

detach_package <- function(pkg, character.only = FALSE)
{
  if(!character.only)
  {
    pkg <- deparse(substitute(pkg))
  }
  search_item <- paste("package", pkg, sep = ":")
  while(search_item %in% search())
  {
    detach(search_item, unload = TRUE, character.only = TRUE)
  }
}

df2json<-function(df){
  
  jsons<-vector()
  
  for(i in 1:nrow(df)){
    json<-"{"
    for(j in 1:ncol(df)){
      dval<-as.character(df[i,j])
      nval<-as.numeric(dval)
      if(!is.na(nval)){
        charval<-dval
      }
      else {
        charval<-paste("\"",dval,"\"",sep="")
      }
      json<-paste(json,"\"",names(df)[j],"\"",":",charval,",",sep="")
    }
    json<-substr(json,1,nchar(json)-1)
    json<-paste(json,"}")
    jsons[i]<-json
  }
  
  return(jsons)
  
}

createRandomSkinnyRecord<-function(metricName, ts, mean, sd){
  r<-data.frame()
  #ts_date <- as.character.Date((as.POSIXlt.numeric(ts_epoch, origin="1970-01-01")))
  r<-rbind(r,cbind(ts, metricName, rnorm(1,mean,sd)))
  names(r)<-c('ts','metric','value')
  return(r)
}


connect<-function(db_host, db_port, db_user, db_pass, db_name){
  oDB_CONNECTION<<-mongoDbConnect(dbName=db_name, host=db_host,port=db_port)
  dbAuthenticate(oDB_CONNECTION,db_user,db_pass)
}

disconnect<-function(){
  dbDisconnect(oDB_CONNECTION)
}

getConnection<-function(){
  return(oDB_CONNECTION)
}

