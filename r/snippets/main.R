
### --- regex ---

## ___ capture groups
install.packages("gsubfn")
library(gsubfn)
text <- "<!doctype html>\r\n<html>\r\n<a class=\"mobile_pollster_name\">junier</a><a class=\"mobile_pollster_name\">marcier</a>\r\n</html>"
strapplyc(text, '<a class=\"mobile_pollster_name\"[^>]*>([a-zA-Z]+)</a>')[[1]]
# [1] "junier"  "marcier"

## global variables
NAMES_MAPPING = NULL
assign("NAMES_MAPPING", mapping, envir = .GlobalEnv)