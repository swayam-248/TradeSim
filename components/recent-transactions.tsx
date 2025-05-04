import { ArrowDown, ArrowUp } from "lucide-react"

export function RecentTransactions() {
  const transactions = [
    {
      id: 1,
      type: "buy",
      symbol: "AAPL",
      amount: "10 shares",
      price: "$182.63",
      total: "$1,826.30",
      date: "Today, 10:45 AM",
    },
    {
      id: 2,
      type: "sell",
      symbol: "TSLA",
      amount: "5 shares",
      price: "$248.50",
      total: "$1,242.50",
      date: "Today, 9:30 AM",
    },
    {
      id: 3,
      type: "buy",
      symbol: "MSFT",
      amount: "8 shares",
      price: "$415.32",
      total: "$3,322.56",
      date: "Yesterday, 3:15 PM",
    },
    {
      id: 4,
      type: "sell",
      symbol: "GOOGL",
      amount: "3 shares",
      price: "$175.85",
      total: "$527.55",
      date: "Yesterday, 11:20 AM",
    },
  ]

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                transaction.type === "buy" ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {transaction.type === "buy" ? (
                <ArrowUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium leading-none">
                {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.symbol}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.amount} @ {transaction.price}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{transaction.total}</p>
            <p className="text-xs text-muted-foreground">{transaction.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
