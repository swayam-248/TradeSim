"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Stocks", win: 72, loss: 28 },
  { name: "Forex", win: 65, loss: 35 },
  { name: "Crypto", win: 58, loss: 42 },
  { name: "Commodities", win: 80, loss: 20 },
]

export function WinRateChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} />
        <YAxis dataKey="name" type="category" />
        <Tooltip formatter={(value) => [`${value}%`, value === data[0].win ? "Win Rate" : "Loss Rate"]} />
        <Legend />
        <Bar dataKey="win" stackId="a" fill="#10b981" name="Win Rate" />
        <Bar dataKey="loss" stackId="a" fill="#ef4444" name="Loss Rate" />
      </BarChart>
    </ResponsiveContainer>
  )
}
