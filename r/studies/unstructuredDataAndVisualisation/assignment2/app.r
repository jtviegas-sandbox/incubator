#################
#  Assignment 2 #
#  Joao Viegas  #
#   R00157699   #
#################

install.packages("shiny")
install.packages("plotly")
library(shiny)
library(plotly)

DATA_FILE<-"data.csv"
currencies<-c('USD', 'CNY', 'JPY','INR', 'GBP','ILS', 'MXN', 'ISK', 'BRL', 'RUB' )
columns<-c('Date', currencies)
file_content <- read.csv(file=DATA_FILE, header=TRUE, sep=",", stringsAsFactors = FALSE)
data <- file_content[columns]
data$Date<-as.Date(data$Date)

log <- function(msg){
  print(paste("###---   ", msg))
}

filter_data <- function(cur, from, to){
  log("@filter_data")
  d<-data[c("Date", cur)]
  colnames(d) <- c("Date", "Currency")
  d<-d[ d$Currency != "N/A", ]
  d<-d[ d$Date >= from & d$Date <= to, ]
  d$Currency<-as.double(d$Currency)
  
  return(d)
}

# Define UI ----  
ui <- fluidPage(
  
  titlePanel("Euro foreign exchange reference rates")
  ,column(12,
    fluidRow(
      column(6,
        fluidRow(
          selectInput("currency", h3("Choose a currency:"), choices = currencies) 
        )
        ,fluidRow(
          textOutput("latest_value")
        )
        ,fluidRow(
          textOutput("earliest_value")
        )
        ,fluidRow(
          textOutput("yearly_variation")
        )
      )
      , column(6, 
               fluidRow(
                 dateRangeInput("dates", h3("Date range"))
               )
               ,fluidRow(
                 textOutput("date_range_minimum")
               )
               ,fluidRow(
                 textOutput("date_range_average")
               )
               ,fluidRow(
                 textOutput("date_range_maximum")
               )
      )
    )
    , fluidRow(
      plotlyOutput("plot") 
    )
  )
)



# Define server logic ----
server <- function(input, output) {
  
  updateWidgets <- function(df){
    log("@updateWidgets")
    
    max_date <- max(df$Date, na.rm = TRUE)
    max_date_row <- df[df$Date==max_date,]
    max_date_value <- max_date_row$Currency
    
    min_date <- min(df$Date, na.rm = TRUE)
    min_date_row <- df[df$Date==min_date,]
    min_date_value <- min_date_row$Currency
    
    max_date_asposix<-as.POSIXlt(max_date)
    max_date_asposix$year<-max_date_asposix$year-1
    one_year_before_max <- as.Date(max_date_asposix)
    one_year_before_max_row <- df[df$Date==one_year_before_max,]
    one_year_before_max_value <- one_year_before_max_row$Currency
    
    log(max_date_value)
    log(one_year_before_max_value)
    log((max_date_value-one_year_before_max_value)/one_year_before_max_value)
    latest_year_variation <- (max_date_value-one_year_before_max_value)/one_year_before_max_value
    latest_year_variation<-round(latest_year_variation*100.0,digits=2)

    min_value <- min(df$Currency, na.rm = TRUE)
    
    avg_value <- mean(df$Currency, na.rm = TRUE)
    avg_value<-round(avg_value,digits=3)
    
    max_value <- max(df$Currency, na.rm = TRUE)
    
    max_value_row <- df[df$Currency==max_value,]
    max_value_date <- max_value_row$Date[1]

    min_value_row <- df[df$Currency==min_value,]
    min_value_date <- min_value_row$Date[1]
    
    output$latest_value <- renderText({ paste("latest value(",toString(max_date),"): ", toString(max_date_value))})
    output$earliest_value <- renderText({ paste("earliest value(",toString(min_date),"): ", toString(min_date_value))})
    output$yearly_variation <- renderText({ paste("yearly valuation (then:",toString(one_year_before_max_value),"): ", toString(latest_year_variation)," %")})
    
    output$date_range_minimum <- renderText({ paste("minimum value (",min_value_date,"): ", toString(min_value))})
    output$date_range_maximum <- renderText({ paste("maximum value(",max_value_date,"): ", toString(max_value))})
    output$date_range_average <- renderText({ paste("avg value: ", toString(avg_value))})
    
  }
  
  input_event <- reactive({
    log("@input_event")
    d<-filter_data(input$currency, input$dates[1], input$dates[2])
    updateWidgets(d)
    return(d)
  })

  output$plot <- renderPlotly({
    log("@renderPlotly")
    event_data <- input_event()
    plot_ly(event_data, x = ~Date, y = ~Currency, type = 'scatter', mode = 'lines')%>% layout(yaxis = list (title = "Currency/€"))
  })
}

# Run the app ----
shinyApp(ui = ui, server = server)