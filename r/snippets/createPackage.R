#setup development packages required
#sudo apt-get install libxml2-dev
install.packages("devtools")
library("devtools")
devtools::install_github("klutometis/roxygen")
library(roxygen2)
setwd(".")
create("myrpack")
#..................
setwd("./myrpack")
document()

