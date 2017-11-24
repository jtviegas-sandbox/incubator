# workspace variables
ls()
# delete some
rm(ts1, ts2)
# delete all workspace vars
rm(list=ls())
# save workspace to a file
save.image()

# redirecting the output
sink("myfile")
# redirecting back to stdout
sink()

# load library
load(survival)
# unload
detach("package:survival")

# data goes throught the package folders 
# finding data (data folder included)
# load data frame
data(thuesen)
thuesen
thuesen$blood.glucose

# pass df object to environment vars
attach(thuesen)
# check the search path, thuesen is there now
search()
blood.glucose

# specify that a data frame should be searched 
# before .GlobalEnv
with(thuesen, plot(blood.glucose, short.velocity))

# selectively attaching data frames
thue2 <- subset(thuesen, blood.glucose<7)
thue2
# changing the attached data to add another vector named log.luc
thue3 <- transform(thuesen, log.luc=log(blood.glucose))
thue3
# an alternative to transform is within
thue4 <- within(thuesen, {
  log.gluc <- log(blood.glucose)
  m <- mean(log.gluc)
  centered.log.gluc <- log.gluc-m
  rm(m)
} )
thue4

#plotting
x <- runif(50,0,2)
y <- runif(50,0,2)
plot(x, y, main="Main title", sub="subtitle", xlab="x-label", ylab="y-label")
#adding to the plot
# line y=a+bx
abline(a=.6,b=.6)
# cross
abline(h=.6,v=.6)

# printing on the margins
for (side in 1:4) mtext(-1:4,side=side,at=.7)
for (side in 1:4) mtext(-1:4,side=side,at=.6,line=-1:4)
mtext(paste("side",1:4), side=1:4, line=1,font=2)

#ploting step by step
#empty plot
plot(x, y, type="n", xlab="", ylab="", axes=F)
#plot points
plot(x,y)
axis(1)
axis(2,at=seq(0.2,1.8,0.2))
box()

title(main="Main title", sub="subtitle",
      xlab="x-label", ylab="y-label")

#combining plots
x<-rnorm(100)
hist(x, freq=F)
curve(dnorm(x), add=T)



