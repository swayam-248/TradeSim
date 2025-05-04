"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, RefreshCw, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { StockChart } from "@/components/stock-chart"
import { CandlestickChart } from "@/components/candlestick-chart"
import { VolumeChart } from "@/components/volume-chart"
import { TechnicalIndicators } from "@/components/technical-indicators"
import { fetchMarketQuotes } from "@/lib/api"

export default function GraphsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [timeframe, setTimeframe] = useState("1D")
  const [quoteData, setQuoteData] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("tradingAppUser")
    if (!user) {
      router.push("/login")
      return
    }

    loadQuoteData()
  }, [router, selectedSymbol])

  const loadQuoteData = async () => {
    setIsLoading(true)
    try {
      const quotes = await fetchMarketQuotes([selectedSymbol])
      if (quotes && quotes.length > 0) {
        setQuoteData(quotes[0])
      } else {
        // Fallback to demo data if API fails
        setQuoteData({
          symbol: selectedSymbol,
          price: "182.63",
          change: "2.45",
          changePercent: "1.36%",
        })
      }
    } catch (error) {
      console.error("Error fetching quote data:", error)
      // Fallback to demo data
      setQuoteData({
        symbol: selectedSymbol,
        price: "182.63",
        change: "2.45",
        changePercent: "1.36%",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadQuoteData()
    setRefreshing(false)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Market Graphs" text="Advanced charting and technical analysis tools.">
        <div className="flex items-center gap-2">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AAPL">AAPL</SelectItem>
              <SelectItem value="MSFT">MSFT</SelectItem>
              <SelectItem value="GOOGL">GOOGL</SelectItem>
              <SelectItem value="AMZN">AMZN</SelectItem>
              <SelectItem value="TSLA">TSLA</SelectItem>
              <SelectItem value="SPY">SPY</SelectItem>
              <SelectItem value="QQQ">QQQ</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </DashboardHeader>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{selectedSymbol}</h2>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : quoteData ? (
            <>
              <span
                className={`text-xl font-semibold ${Number.parseFloat(quoteData.change) >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                ${Number.parseFloat(quoteData.price).toFixed(2)}
              </span>
              <span
                className={`text-sm ${Number.parseFloat(quoteData.change) >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {Number.parseFloat(quoteData.change) >= 0 ? "+" : ""}
                {quoteData.change} ({quoteData.changePercent})
              </span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {["1H", "1D", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="price" className="space-y-4">
        <TabsList>
          <TabsTrigger value="price">Price Chart</TabsTrigger>
          <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} Price Chart</CardTitle>
              <CardDescription>
                {timeframe} timeframe - Last updated: {new Date().toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <StockChart symbol={selectedSymbol} timeframe={timeframe} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candlestick" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} Candlestick Chart</CardTitle>
              <CardDescription>
                {timeframe} timeframe - Last updated: {new Date().toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <CandlestickChart symbol={selectedSymbol} timeframe={timeframe} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} Volume Analysis</CardTitle>
              <CardDescription>
                {timeframe} timeframe - Last updated: {new Date().toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <VolumeChart symbol={selectedSymbol} timeframe={timeframe} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} Technical Indicators</CardTitle>
              <CardDescription>Key technical indicators and signals</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <TechnicalIndicators symbol={selectedSymbol} timeframe={timeframe} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
