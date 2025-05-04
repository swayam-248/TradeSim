"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PerformanceChart } from "@/components/performance-chart"
import { ProfitLossChart } from "@/components/profit-loss-chart"
import { TradeDistributionChart } from "@/components/trade-distribution-chart"
import { WinRateChart } from "@/components/win-rate-chart"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("tradingAppUser")
    if (!user) {
      router.push("/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Detailed analysis of your trading performance.">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="profitloss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">+32.5%</div>
                <p className="text-xs text-muted-foreground">Since account opening</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">Last 100 trades</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">$245.32</div>
                <p className="text-xs text-muted-foreground">Per winning trade</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">-$112.45</div>
                <p className="text-xs text-muted-foreground">Per losing trade</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Your account growth trajectory</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PerformanceChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Win Rate Analysis</CardTitle>
                <CardDescription>Win/loss ratio by asset class</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <WinRateChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profitloss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>Detailed breakdown of your trading P&L</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ProfitLossChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Distribution</CardTitle>
              <CardDescription>Analysis of your trading patterns</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <TradeDistributionChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sharpe Ratio</CardTitle>
                <CardDescription>Risk-adjusted return measure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.85</div>
                <p className="text-sm text-muted-foreground mt-2">
                  A Sharpe ratio above 1.0 is considered good, above 2.0 is very good, and 3.0 or higher is excellent.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Max Drawdown</CardTitle>
                <CardDescription>Largest peak-to-trough decline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">-18.3%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Occurred between May 12 and June 24, 2023. Recovery took 45 days.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Profit Factor</CardTitle>
                <CardDescription>Ratio of gross profit to gross loss</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.18</div>
                <p className="text-sm text-muted-foreground mt-2">
                  A profit factor above 1.5 is good, above 2.0 is excellent.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Trade Duration</CardTitle>
                <CardDescription>How long you hold positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2 days</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Winning trades: 4.5 days average
                  <br />
                  Losing trades: 1.8 days average
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk-Reward Ratio</CardTitle>
                <CardDescription>Average reward relative to risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1:2.18</div>
                <p className="text-sm text-muted-foreground mt-2">
                  You're risking $1 to potentially gain $2.18 on average per trade.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expectancy</CardTitle>
                <CardDescription>Expected return per dollar risked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-500">$1.32</div>
                <p className="text-sm text-muted-foreground mt-2">
                  For every $1 risked, you can expect to make $1.32 on average.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
