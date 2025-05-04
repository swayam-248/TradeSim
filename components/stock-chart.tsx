"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertCircle, Loader2 } from "lucide-react"

import { fetchStockData } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StockChartProps {
  symbol: string
  timeframe: string
}

export function StockChart({ symbol, timeframe }: StockChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchStockData(symbol, timeframe)
      .then((data) => {
        setData(data)
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip formatter={(value) => [`$${value}`, "Price"]} labelFormatter={(label) => `Date: ${label}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
          name={symbol}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
