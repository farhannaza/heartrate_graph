"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Sample data (you would replace this with real data from your backend)
const generateSampleData = (hours: number) => {
  const data = []
  const now = new Date()
  for (let i = hours; i > 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      heartRate: Math.floor(Math.random() * (100 - 60 + 1) + 60), // Random heart rate between 60 and 100
    })
  }
  return data
}

export default function HeartRateMonitor() {
  const [timeRange, setTimeRange] = useState("6")
  const data = generateSampleData(Number.parseInt(timeRange))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Heart Rate History</CardTitle>
        <CardDescription>Patient&apos;s heart rate over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Last 6 hours</SelectItem>
              <SelectItem value="12">Last 12 hours</SelectItem>
              <SelectItem value="24">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer
          config={{
            heartRate: {
              label: "Heart Rate",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--foreground))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--foreground))" }}
                domain={[40, 120]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="heartRate" stroke="var(--color-heartRate)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          Normal resting heart rate for adults: 60-100 beats per minute
        </div>
      </CardContent>
    </Card>
  )
}

