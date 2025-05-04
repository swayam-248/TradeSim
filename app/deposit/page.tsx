"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Landmark, Loader2, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"

export default function DepositPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("tradingAppUser")
    if (!user) {
      router.push("/login")
      return
    }
  }, [router])

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Deposit successful",
        description: `$${amount} has been added to your account`,
      })

      setAmount("")
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: "There was an error processing your deposit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Deposit Funds" text="Add funds to your trading account." />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Tabs defaultValue="deposit" className="space-y-4">
            <TabsList>
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                  <CardDescription>Choose your preferred payment method and amount</CardDescription>
                </CardHeader>
                <form onSubmit={handleDeposit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <RadioGroup
                        defaultValue="card"
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="grid grid-cols-1 gap-4 md:grid-cols-3"
                      >
                        <div>
                          <RadioGroupItem value="card" id="card" className="peer sr-only" />
                          <Label
                            htmlFor="card"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <CreditCard className="mb-3 h-6 w-6" />
                            Credit Card
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                          <Label
                            htmlFor="bank"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Landmark className="mb-3 h-6 w-6" />
                            Bank Transfer
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
                          <Label
                            htmlFor="crypto"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <Wallet className="mb-3 h-6 w-6" />
                            Cryptocurrency
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Cardholder Name</Label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="number">Card Number</Label>
                          <Input id="number" placeholder="4242 4242 4242 4242" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      <div className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                          <div className="font-medium">Bank Transfer Details</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Account Name: Trading Platform Inc.</p>
                            <p>Account Number: 1234567890</p>
                            <p>Routing Number: 987654321</p>
                            <p>Bank: Global Bank</p>
                            <p>Reference: Your account ID</p>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reference">Your Reference Number</Label>
                          <Input id="reference" placeholder="Enter bank reference" required />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "crypto" && (
                      <div className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                          <div className="font-medium">Cryptocurrency Deposit</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Send your deposit to the following address:</p>
                            <p className="mt-2 font-mono">0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t</p>
                            <p className="mt-2">Supported coins: BTC, ETH, USDT, USDC</p>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="txid">Transaction ID</Label>
                          <Input id="txid" placeholder="Enter transaction hash" required />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Deposit Funds"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit History</CardTitle>
                  <CardDescription>Your recent deposit transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="font-medium">$5,000.00</div>
                        <div className="text-sm text-muted-foreground">Bank Transfer</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm font-medium text-emerald-500">
                          <Check className="mr-1 h-4 w-4" /> Completed
                        </div>
                        <div className="text-sm text-muted-foreground">Apr 12, 2023</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="font-medium">$2,500.00</div>
                        <div className="text-sm text-muted-foreground">Credit Card</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm font-medium text-emerald-500">
                          <Check className="mr-1 h-4 w-4" /> Completed
                        </div>
                        <div className="text-sm text-muted-foreground">Mar 24, 2023</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="font-medium">$1,000.00</div>
                        <div className="text-sm text-muted-foreground">Cryptocurrency (BTC)</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm font-medium text-emerald-500">
                          <Check className="mr-1 h-4 w-4" /> Completed
                        </div>
                        <div className="text-sm text-muted-foreground">Feb 15, 2023</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Your current account balance and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm font-medium">Available Balance</div>
                <div className="text-3xl font-bold">$45,231.89</div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Deposit Limits</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Limit:</span>
                    <span>$50,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Limit:</span>
                    <span>$250,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used This Month:</span>
                    <span>$8,500.00</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Processing Times</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Credit Card:</span>
                    <span>Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Transfer:</span>
                    <span>1-3 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cryptocurrency:</span>
                    <span>10-60 Minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Contact our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  If you have any questions or issues with deposits, our support team is available 24/7.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
