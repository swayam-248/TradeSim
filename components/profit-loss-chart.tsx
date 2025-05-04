"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

const data = [
  { name: "Jan", profit: 1200, loss: -800 },
  { name: "Feb", profit: 900, loss: -400 },
  { name: "Mar", profit: 1500, loss: -300 },
  { name: "Apr", profit: 800, loss: -1200 },
  { name: "May", profit: 1700, loss: -500 },
  { name: "Jun", profit: 1300, loss: -700 },
  { name: "Jul", profit: 1800, loss: -400 },
  { name: "Aug", profit: 1400, loss: -600 },
  { name: "Sep", profit: 2000, loss: -300 },
  { name: "Oct", profit: 1600, loss: -800 },
  { name: "Nov", profit: 1900, loss: -500 },
  { name: "Dec", profit: 2200, loss: -400 },
]

export function ProfitLossChart() {
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
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${Math.abs(value)}`, value > 0 ? "Profit" : "Loss"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="profit" fill="#10b981" name="Profit" />
        <Bar dataKey="loss" fill="#ef4444" name="Loss" />
      </BarChart>
    </ResponsiveContainer>
  )
}
