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

install_if_missing <- function(p) {
  if (p %in% rownames(installed.packages()) == FALSE) {
    install.packages(p, dependencies = TRUE)
  }
  else {
    cat(paste("Skipping already installed package:", p, "\n"))
  }
}

arModel2Data <- function(n, order, params) {
  set.seed(13);
  x <- w <- rnorm(n);
  for(t in (1+order):n){
    value = w[t]
    for(l in 1:order){
      value = value + params[l] * x[t-l]
    }
    x[t] = value
  }
 return(x)
}