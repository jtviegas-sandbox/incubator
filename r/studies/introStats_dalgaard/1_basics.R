weight <- c(60,72,57,90,95,72)
height <- c(1.75, 1.80, 1.65, 1.90, 1.74, 1.91)
bmi<-weight/height^2

xbar <- sum(weight)/length(height)
deviation <- weight-xbar
sqDeviation <- deviation^2
stdDeviation <- sqrt(sum(sqDeviation)/(length(height)-1) )
stdDeviation2<-sd(weigth)
t.test(bmi, mu=22.5)

plot(x=height, y=weight)
hh <- c(1.65, 1.70, 1.75, 1.80, 1.85, 1.90)
lines(hh, 22.5 * hh^2)
#checking function args
args(plot.default)

#creating arrays
x<-(1:12)
dim(x)<-c(3,4)

x<-matrix(1:12,nrow=3, byrow=T)
# assigning row names
rownames(x)<-LETTERS[1:3]
# transpose
t(x)

# factors
pain<-c(0,3,2,2,1)
fpain<-factor(pain, levels=0:3)
levels(fpain)<-c("none","mild","medium","severe")
fpain
as.numeric(fpain)

# lists
intake.pre <- c(5260,5470,5640,6180,6390,
                6515,6805,7515,7515,8230,8770)
intake.post <- c(3910,4220,3885,5160,5645,
                 4680,5265,5975,6790,6900,7335)
mylist <- list(before=intake.pre, after=intake.post)
mylist$before

# data frames

df <- data.frame(intake.pre, intake.post)
df
df$intake.pre
df$intake.pre[c(1,3)]
#...all except
df$intake.pre[-c(1,3)]
df$intake.pre[intake.pre>6000 & intake.pre<7000]

is.na(x)

# data.frame grouping
expend <- c(9.21, 11.51, 12.79, 9.68, 7.58, 9.19, 8.11)
stature <- c("obese", "obese", "obese", "obese", "lean", "obese", "lean")

df2 <- data.frame(expend, stature)
df2

df2.lean<-df2$expend[df2$stature=="lean"]
df2.obese<-df2$expend[df2$stature=="obese"]
split(df2$expend, df2$stature)
# lapply -> lists
lapply(df2, mean, na.rm=T)
# sapply -> vector, array or matrixes
sapply(df2, mean, na.rm=T)

replicate(2,mean(df2$expend))

# apply -> applied on rows or columns
# returns vector, array or list
#...on rows
apply(df,1, mean)
#...on columns
apply(df,2, mean)

# tapply -> tables of a function based on factoring from the 2nd parameter
tapply(df2$expend,df2$stature,mean)

#sort
sort(df2$expend)

# order
# first order a variable
orderedIndex <- order(df2$expend)
# then use it to order it
df2$expend[orderedIndex]
df2[orderedIndex,]





