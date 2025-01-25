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
  time: string; // Formatted time string
  timestamp: number; // UNIX timestamp
  bpm: number; // Heart rate (bpm) value
}

export default function HeartRateMonitor() {
  const [timeRange, setTimeRange] = useState("6"); // Default to the last 6 hours
  const [data, setData] = useState<HeartRateDataPoint[]>([]);

  useEffect(() => {
    const heartRateRef = ref(database, "heart_rate_data/heart_rate_monitor");

    const unsubscribe = onValue(heartRateRef, (snapshot) => {
      const rawData = snapshot.val();
      console.log("Raw data from Firebase:", rawData); // Debugging log

      if (rawData) {
        const now = Date.now();
        const timeLimit = now - Number(timeRange) * 60 * 60 * 1000;

        // Map and filter the data from Firebase
        const formattedData: HeartRateDataPoint[] = Object.values(rawData)
          .map((entry: any) => ({
            time: new Date(entry.timestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: entry.timestamp * 1000, // Convert seconds to milliseconds
            bpm: entry.bpm,
          }))
          .filter((dataPoint) => dataPoint.timestamp >= timeLimit);

        console.log("Formatted data:", formattedData); // Debugging log
        setData(formattedData);
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
