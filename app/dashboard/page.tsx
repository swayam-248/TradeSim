"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, LineChart, TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketOverview } from "@/components/market-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { TopAssets } from "@/components/top-assets"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("tradingAppUser")
    if (!user) {
      router.push("/login")
      return
    }

    setUserData(JSON.parse(user))

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  if (!userData) {
    return null
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back to your trading dashboard." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+$2,350.00</div>
            <p className="text-xs text-muted-foreground">+4.5% today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 in profit, 9 in loss</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bearish</div>
            <p className="text-xs text-muted-foreground">65% of traders are selling</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <MarketOverview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your most recent trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Assets</CardTitle>
            <CardDescription>Best performing assets in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <TopAssets />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Trading Activity</CardTitle>
            <CardDescription>Your trading volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week" className="space-y-4">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
              <TabsContent value="day" className="space-y-4">
                <div className="h-[300px] w-full">
                  <MarketOverview />
                </div>
              </TabsContent>
              <TabsContent value="week" className="space-y-4">
                <div className="h-[300px] w-full">
                  <MarketOverview />
                </div>
              </TabsContent>
              <TabsContent value="month" className="space-y-4">
                <div className="h-[300px] w-full">
                  <MarketOverview />
                </div>
              </TabsContent>
              <TabsContent value="year" className="space-y-4">
                <div className="h-[300px] w-full">
                  <MarketOverview />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
