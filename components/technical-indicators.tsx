"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchStockData, calculateTechnicalIndicators } from "@/lib/api"

interface TechnicalIndicatorsProps {
  symbol: string
  timeframe: string
}

export function TechnicalIndicators({ symbol, timeframe }: TechnicalIndicatorsProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchStockData(symbol, timeframe)
      .then((priceData) => {
        // Calculate technical indicators from the price data
        const indicators = calculateTechnicalIndicators(priceData)
        setData(indicators)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching stock data:", err)
        setError("Failed to load technical indicators. Please try again later.")
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
          No technical indicator data is available for {symbol} with the selected timeframe. Please try a different
          symbol or timeframe.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted p-4">
        <div className="text-lg font-medium">Technical Analysis Summary</div>
        <div className="mt-2 flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-3 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Buy: {data.filter((item) => item.signal === "Buy").length}
          </Badge>
          <Badge variant="outline" className="text-lg px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Neutral: {data.filter((item) => item.signal === "Neutral").length}
          </Badge>
          <Badge variant="outline" className="text-lg px-3 py-1 bg-red-100 text-red-700 hover:bg-red-100">
            Sell: {data.filter((item) => item.signal === "Sell").length}
          </Badge>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Indicator</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Signal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((indicator, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{indicator.name}</TableCell>
              <TableCell>{indicator.value}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`
                    ${indicator.signal === "Buy" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                    ${indicator.signal === "Neutral" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" : ""}
                    ${indicator.signal === "Sell" ? "bg-red-100 text-red-700 hover:bg-red-100" : ""}
                  `}
                >
                  {indicator.signal}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
