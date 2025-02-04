"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface ChartData {
  name: string
  value: number
  color: string
}

interface ProductivityChartProps {
  data: {
    HLV: number
    HDV: number
    LDV: number
    ZV: number
  }
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  const chartData: ChartData[] = [
    { name: "HLV", value: data.HLV, color: "#16a34a" },
    { name: "HDV", value: data.HDV, color: "#2563eb" },
    { name: "LDV", value: data.LDV, color: "#38bdf8" },
    { name: "ZV", value: data.ZV, color: "#f97316" },
  ]

  const totalHours = Object.values(data).reduce((sum, value) => sum + value, 0)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.4
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
percent !== 0 ? (

      <text 
        x={x+6}
        y={y+6}
        fill="white" 
        textAnchor={x > cx ? "start" : "end"} 
        dominantBaseline="central"
      >
        {`${chartData[index].name} `}{`${(percent * 100).toFixed(0)}%`}
      </text>
  

): null
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Week Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <Table>
          <TableBody>
            {chartData.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium" style={{ color: item.color }}>
                  {item.name === "HLV" && "HIGH LIFE TIME VALUE"}
                  {item.name === "HDV" && "HIGH DOLLAR VALUE"}
                  {item.name === "LDV" && "LOW DOLLAR VALUE"}
                  {item.name === "ZV" && "ZERO DOLLAR VALUE"}
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(item.value)} ({Math.round((item.value / totalHours) * 100)}%)
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total Hours</TableCell>
              <TableCell className="text-right font-bold">{totalHours}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

