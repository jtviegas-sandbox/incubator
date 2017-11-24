source('utils.R')
install_if_missing('quantmod')
library(quantmod)

getSymbols("GBP/EUR",src="oanda")
getSymbols("GLD",src="google")
getSymbols("BP",src="google")
getSymbols("LLOY",src="google")
getSymbols("MRW",src="google")
getSymbols("NG",src="google")

gbpeur <- GBPEUR[time(GBPEUR) >= '2016-01-01']
gld <- GLD[time(GLD) >= '2016-01-01'][,4]
bp <- BP[time(BP) >= '2016-01-01'][,4]
lloy <- LLOY[time(LLOY) >= '2016-01-01'][,4]
mrw <- MRW[time(MRW) >= '2016-01-01'][,4]
ng <- NG[time(NG) >= '2016-01-01'][,4]


#symbols <- cbind( gbpeur, gld, bp, lloy, mrw, ng )
symbols <- cbind( gbpeur, gld, mrw )

for(i in 1:length(symbols[1,])){
  
  label <- labels(symbols)[[2]][i]
  print(label)
  diffLabel <- paste('diff( ', label, ' )')
  print(paste('at: ', i, ' => ', label))
  data <- symbols[,i]
  barChart(data, name = label)
  barChart(diff(data), name = diffLabel)
  #candleChart(gbpeur, subset='2016-06-22::', multi.col=TRUE) 
  acf(data, na.action = na.exclude, main = label)
  acf(diff(data), na.action = na.exclude, main = diffLabel)
  plot(decompose(ts(data[is.na(data) == FALSE], frequency = 30)))
  plot(decompose(ts(data[is.na(data) == FALSE], frequency = 30), type='mult'))
  print('fitting the data to an autoregressive model')
  data.ar <- ar(data.frame(data)[,1], method="mle")
  ardata <- arModel2Data(length(data), data.ar$order, data.ar$ar) 
  acf(ardata, na.action = na.exclude, main = paste('fitted AR: ', label))
  plot(ardata, type="l")
}
#@Autoregressive models


