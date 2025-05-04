"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

import { fetchStockData } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function MarketOverview() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Use S&P 500 ETF (SPY) as a market overview
    fetchStockData("SPY", "1Y")
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching market overview data:", err)
        setError("Failed to load market overview. Using demo data.")
        // Fallback to demo data
        setData(getDemoMarketData())
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Price"]} />
        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Fallback demo market data
function getDemoMarketData() {
  return [
    { name: "Jan", price: 4000 },
    { name: "Feb", price: 3000 },
    { name: "Mar", price: 5000 },
    { name: "Apr", price: 2780 },
    { name: "May", price: 1890 },
    { name: "Jun", price: 2390 },
    { name: "Jul", price: 3490 },
    { name: "Aug", price: 4000 },
    { name: "Sep", price: 4500 },
    { name: "Oct", price: 5200 },
    { name: "Nov", price: 4800 },
    { name: "Dec", price: 6000 },
  ]
}
