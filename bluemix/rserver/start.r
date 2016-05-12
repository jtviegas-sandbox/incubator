
writeDumbData<- function(){
  # create a 2 by 5 matrix
  x <- matrix(rnorm(10,0,1), ncol = 5)
 
  # Writing to the "console" 'tab-delimited'
  # two rows, five cols but the first row is 1 2 3 4 5
  write(x, "data.dat", sep = "\t", append = FALSE)
  unlink("data") # tidy up
}


repeat {
  Sys.sleep(10)
  writeDumbData()
  
}

