"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 10500 },
  { name: "Mar", value: 11200 },
  { name: "Apr", value: 10800 },
  { name: "May", value: 11500 },
  { name: "Jun", value: 12300 },
  { name: "Jul", value: 13100 },
  { name: "Aug", value: 12800 },
  { name: "Sep", value: 13500 },
  { name: "Oct", value: 14200 },
  { name: "Nov", value: 13800 },
  { name: "Dec", value: 15000 },
]

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Account Value"]} labelFormatter={(label) => `Month: ${label}`} />
        <Line type="monotone" dataKey="value" stroke="#10b981" activeDot={{ r: 8 }} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
