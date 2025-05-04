// Alpha Vantage API key
// In a production app, this would be stored in environment variables
const API_KEY = "THXYRUA81I3RSKGN" // Using Alpha Vantage's demo key for this example

/**
 * Fetch stock time series data from Alpha Vantage API
 */
export async function fetchStockData(symbol: string, interval = "daily") {
  try {
    let endpoint = ""
    let additionalParams = ""

    // Map our app's timeframe to Alpha Vantage's endpoints
    switch (interval) {
      case "1D":
        endpoint = "TIME_SERIES_INTRADAY"
        additionalParams = "&interval=1min" // Default to 1-minute intervals for real-time data
        break
      case "1W":
      case "1M":
        endpoint = "TIME_SERIES_DAILY"
        break
      case "3M":
      case "1Y":
      case "ALL":
        endpoint = "TIME_SERIES_WEEKLY"
        break
      default:
        endpoint = "TIME_SERIES_DAILY"
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=${endpoint}&symbol=${symbol}${additionalParams}&apikey=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle API errors
    if (data["Error Message"]) {
      throw new Error(data["Error Message"])
    }

    if (data["Note"]) {
      throw new Error("API rate limit exceeded. Please try again later.")
    }

    // Transform the data into the format our charts expect
    return transformTimeSeriesData(data, interval)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw error
  }
}

/**
 * Fetch global market quotes for multiple symbols
 */
export async function fetchMarketQuotes(symbols: string[]) {
  try {
    const promises = symbols.map((symbol) =>
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`).then((res) =>
        res.json(),
      ),
    )

    const results = await Promise.all(promises)
    return results
      .map((result) => {
        const quote = result["Global Quote"]
        if (!quote) return null

        return {
          symbol: quote["01. symbol"],
          price: quote["05. price"],
          change: quote["09. change"],
          changePercent: quote["10. change percent"],
          volume: quote["06. volume"],
          latestTradingDay: quote["07. latest trading day"],
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error("Error fetching market quotes:", error)
    throw error
  }
}

/**
 * Fetch company overview data
 */
export async function fetchCompanyOverview(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching company overview:", error)
    throw error
  }
}

/**
 * Transform Alpha Vantage time series data into a format our charts can use
 */
function transformTimeSeriesData(data: any, interval: string) {
  // Determine which time series key to use based on the interval
  let timeSeriesKey = ""

  if (data["Time Series (5min)"]) {
    timeSeriesKey = "Time Series (5min)"
  } else if (data["Time Series (Daily)"]) {
    timeSeriesKey = "Time Series (Daily)"
  } else if (data["Weekly Time Series"]) {
    timeSeriesKey = "Weekly Time Series"
  } else if (data["Monthly Time Series"]) {
    timeSeriesKey = "Monthly Time Series"
  } else {
    // If we can't find a valid time series, return empty array
    return []
  }

  const timeSeries = data[timeSeriesKey]

  // Convert the object to an array and sort by date
  const result = Object.entries(timeSeries)
    .map(([date, values]: [string, any]) => ({
      date,
      open: Number.parseFloat(values["1. open"]),
      high: Number.parseFloat(values["2. high"]),
      low: Number.parseFloat(values["3. low"]),
      close: Number.parseFloat(values["4. close"]),
      volume: Number.parseInt(values["5. volume"], 10),
      // For our charts, we'll use the closing price as the main price
      price: Number.parseFloat(values["4. close"]),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Limit the number of data points based on the interval
  let limitedResult = result

  if (interval === "1D") {
    limitedResult = result.slice(-24) // Last 24 5-minute intervals
  } else if (interval === "1W") {
    limitedResult = result.slice(-7) // Last 7 days
  } else if (interval === "1M") {
    limitedResult = result.slice(-30) // Last 30 days
  } else if (interval === "3M") {
    limitedResult = result.slice(-13) // Last 13 weeks (approximately 3 months)
  } else if (interval === "1Y") {
    limitedResult = result.slice(-52) // Last 52 weeks
  }

  // Format dates for display
  return limitedResult.map((item) => {
    let formattedDate = item.date

    if (interval === "1D") {
      formattedDate = new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (interval === "1W" || interval === "1M") {
      formattedDate = new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      formattedDate = new Date(item.date).toLocaleDateString([], { month: "short", year: "2-digit" })
    }

    return {
      ...item,
      date: formattedDate,
    }
  })
}

/**
 * Calculate technical indicators based on price data
 */
export function calculateTechnicalIndicators(priceData: any[]) {
  if (!priceData || priceData.length === 0) {
    return []
  }

  const prices = priceData.map((d) => d.price)
  const latestPrice = prices[prices.length - 1]

  // Calculate Simple Moving Averages
  const sma50 = calculateSMA(prices, 50)
  const sma200 = calculateSMA(prices, 200)

  // Calculate RSI
  const rsi = calculateRSI(prices, 14)

  // Calculate MACD
  const macd = calculateMACD(prices, 12, 26, 9)

  // Generate signals based on indicators
  const sma50Signal = latestPrice > sma50 ? "Buy" : latestPrice < sma50 ? "Sell" : "Neutral"
  const sma200Signal = latestPrice > sma200 ? "Buy" : latestPrice < sma200 ? "Sell" : "Neutral"
  const rsiSignal = rsi > 70 ? "Sell" : rsi < 30 ? "Buy" : "Neutral"
  const macdSignal = macd.histogram > 0 ? "Buy" : macd.histogram < 0 ? "Sell" : "Neutral"

  return [
    {
      name: "Moving Average (50)",
      value: sma50.toFixed(2),
      signal: sma50Signal,
    },
    {
      name: "Moving Average (200)",
      value: sma200.toFixed(2),
      signal: sma200Signal,
    },
    {
      name: "RSI (14)",
      value: rsi.toFixed(2),
      signal: rsiSignal,
    },
    {
      name: "MACD (12,26,9)",
      value: macd.histogram.toFixed(2),
      signal: macdSignal,
    },
    {
      name: "Price",
      value: latestPrice.toFixed(2),
      signal: "Neutral",
    },
  ]
}

// Helper functions for technical indicators
function calculateSMA(prices: number[], period: number) {
  if (prices.length < period) {
    return prices.reduce((sum, price) => sum + price, 0) / prices.length
  }

  const pricesForPeriod = prices.slice(-period)
  return pricesForPeriod.reduce((sum, price) => sum + price, 0) / period
}

function calculateRSI(prices: number[], period: number) {
  if (prices.length <= period) {
    return 50 // Default to neutral if not enough data
  }

  let gains = 0
  let losses = 0

  for (let i = prices.length - period; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1]
    if (difference >= 0) {
      gains += difference
    } else {
      losses -= difference
    }
  }

  if (losses === 0) return 100

  const relativeStrength = gains / losses
  return 100 - 100 / (1 + relativeStrength)
}

function calculateMACD(prices: number[], fastPeriod: number, slowPeriod: number, signalPeriod: number) {
  const fastEMA = calculateEMA(prices, fastPeriod)
  const slowEMA = calculateEMA(prices, slowPeriod)
  const macdLine = fastEMA - slowEMA

  // For simplicity, we'll use a simple average for the signal line
  const signalLine = calculateSMA(
    prices
      .slice(-signalPeriod)
      .map(
        (_, i) =>
          calculateEMA(prices.slice(0, prices.length - signalPeriod + i + 1), fastPeriod) -
          calculateEMA(prices.slice(0, prices.length - signalPeriod + i + 1), slowPeriod),
      ),
    signalPeriod,
  )

  return {
    macdLine,
    signalLine,
    histogram: macdLine - signalLine,
  }
}

function calculateEMA(prices: number[], period: number) {
  const k = 2 / (period + 1)

  // Start with SMA for the first EMA value
  let ema = calculateSMA(prices.slice(0, period), period)

  // Calculate EMA for the rest of the prices
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k)
  }

  return ema
}
