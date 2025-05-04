"use client"

import { useEffect, useState } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertCircle, Loader2 } from "lucide-react"

import { fetchStockData } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CandlestickChartProps {
  symbol: string
  timeframe: string
}

export function CandlestickChart({ symbol, timeframe }: CandlestickChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchStockData(symbol, timeframe)
      .then((data) => {
        // Transform data for candlestick visualization
        const transformedData = data.map((item: any) => ({
          ...item,
          // Calculate the body of the candlestick
          bullish: item.close > item.open ? item.close - item.open : 0,
          bearish: item.close < item.open ? item.open - item.close : 0,
          // For the wicks
          highWick: item.high - Math.max(item.open, item.close),
          lowWick: Math.min(item.open, item.close) - item.low,
        }))

        setData(transformedData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching stock data:", err)
        setError("Failed to load market data. Please try again later.")
        setLoading(false)
      })
  }, [symbol, timeframe])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          No market data is available for {symbol} with the selected timeframe. Please try a different symbol or
          timeframe.
        </AlertDescription>
      </Alert>
    )
  }

  // This is a simplified representation of a candlestick chart
  // In a production app, you would use a specialized candlestick chart library
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip
          formatter={(value, name) => {
            if (name === "high") return [`$${value}`, "High"]
            if (name === "low") return [`$${value}`, "Low"]
            if (name === "open") return [`$${value}`, "Open"]
            if (name === "close") return [`$${value}`, "Close"]
            if (name === "bullish") return [`$${value}`, "Bullish"]
            if (name === "bearish") return [`$${value}`, "Bearish"]
            return [`$${value}`, name]
          }}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Bar dataKey="bullish" fill="#10b981" stackId="stack" name="Bullish" />
        <Bar dataKey="bearish" fill="#ef4444" stackId="stack" name="Bearish" />
        <Line type="monotone" dataKey="high" stroke="#10b981" dot={false} name="High" />
        <Line type="monotone" dataKey="low" stroke="#ef4444" dot={false} name="Low" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
