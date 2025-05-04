"use client"

import { useEffect, useState } from "react"
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react"

import { fetchMarketQuotes } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TopAssets() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // List of popular stock symbols
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

    fetchMarketQuotes(symbols)
      .then((data) => {
        if (data && data.length > 0) {
          // Transform the data for our UI
          const formattedAssets = data.map((quote) => ({
            id: quote.symbol,
            name: getCompanyName(quote.symbol),
            symbol: quote.symbol,
            price: `$${Number.parseFloat(quote.price).toFixed(2)}`,
            change: quote.changePercent,
            trending: Number.parseFloat(quote.change) >= 0 ? "up" : "down",
          }))

          setAssets(formattedAssets)
        } else {
          // If we get an empty response, use demo data
          setAssets(getDemoAssets())
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching market quotes:", err)
        setError("Failed to load asset data. Using demo data.")
        setAssets(getDemoAssets())
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
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
    <div className="space-y-4">
      {assets.map((asset) => (
        <div key={asset.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{asset.name}</p>
            <p className="text-xs text-muted-foreground">{asset.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{asset.price}</p>
            <p
              className={`text-xs flex items-center justify-end ${
                asset.trending === "up" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {asset.trending === "up" ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {asset.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper function to get company names
function getCompanyName(symbol: string) {
  const companies: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corp.",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
    TSLA: "Tesla Inc.",
    BTC: "Bitcoin",
    ETH: "Ethereum",
  }

  return companies[symbol] || symbol
}

// Fallback demo assets in case the API fails
function getDemoAssets() {
  return [
    {
      id: 1,
      name: "Apple Inc.",
      symbol: "AAPL",
      price: "$182.63",
      change: "+1.36%",
      trending: "up",
    },
    {
      id: 2,
      name: "Microsoft Corp.",
      symbol: "MSFT",
      price: "$415.32",
      change: "+0.89%",
      trending: "up",
    },
    {
      id: 3,
      name: "Tesla Inc.",
      symbol: "TSLA",
      price: "$248.50",
      change: "-2.14%",
      trending: "down",
    },
    {
      id: 4,
      name: "Alphabet Inc.",
      symbol: "GOOGL",
      price: "$175.85",
      change: "+0.75%",
      trending: "up",
    },
    {
      id: 5,
      name: "Amazon.com Inc.",
      symbol: "AMZN",
      price: "$178.75",
      change: "-0.32%",
      trending: "down",
    },
  ]
}
