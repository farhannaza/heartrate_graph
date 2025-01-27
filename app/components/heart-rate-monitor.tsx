"use client";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface HeartRateDataPoint {
  bpm: number;
  readable_date: string;
  timestamp: number;
}

export default function HeartRateMonitor() {
  const [timeRange, setTimeRange] = useState("today"); // Default to today
  const [data, setData] = useState<HeartRateDataPoint[]>([]);

  useEffect(() => {
    const heartRateRef = ref(database, "heart_rate_data");

    const unsubscribe = onValue(heartRateRef, (snapshot) => {
      const rawData = snapshot.val();
      console.log("Raw data from Firebase:", rawData); // Debugging log

      if (rawData) {
        // Convert Firebase data to an array and process it
        const now = Date.now();
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const startOfYesterday = startOfDay - 24 * 60 * 60 * 1000;
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();

        const filteredData = Object.values(rawData)
          .map((entry: any) => ({
            bpm: entry.bpm,
            readable_date: entry.readable_date,
            timestamp: entry.timestamp * 1000, // Convert seconds to milliseconds
          }))
          .filter((dataPoint: HeartRateDataPoint) => {
            switch (timeRange) {
              case "today":
                return dataPoint.timestamp >= startOfDay;
              case "yesterday":
                return dataPoint.timestamp >= startOfYesterday && dataPoint.timestamp < startOfDay;
              case "month":
                return dataPoint.timestamp >= startOfMonth;
              case "year":
                return dataPoint.timestamp >= startOfYear;
              default:
                return true;
            }
          });

        console.log("Filtered Data:", filteredData); // Debugging log
        setData(filteredData);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [timeRange]);

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
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
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
                dataKey="readable_date"
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--foreground))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--foreground))" }}
                domain={[40, 120]} // Adjust Y-axis range
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="bpm"
                stroke="var(--color-heartRate)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          Normal resting heart rate for adults: 60-100 beats per minute
        </div>
      </CardContent>
    </Card>
  );
}
