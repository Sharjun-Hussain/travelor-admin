"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Calendar, Hotel, TrendingUp, TrendingDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Booking-specific data
const bookingData = [
  { date: "2024-04-01", bookings: 372, cancellations: 28 },
  { date: "2024-04-02", bookings: 277, cancellations: 19 },
  { date: "2024-04-03", bookings: 287, cancellations: 22 },
  { date: "2024-04-04", bookings: 502, cancellations: 31 },
  { date: "2024-04-05", bookings: 663, cancellations: 42 },
  { date: "2024-04-06", bookings: 641, cancellations: 38 },
  { date: "2024-04-07", bookings: 425, cancellations: 29 },
  { date: "2024-04-08", bookings: 729, cancellations: 51 },
  { date: "2024-04-09", bookings: 169, cancellations: 14 },
  { date: "2024-04-10", bookings: 451, cancellations: 32 },
  { date: "2024-04-11", bookings: 677, cancellations: 45 },
  { date: "2024-04-12", bookings: 502, cancellations: 37 },
  { date: "2024-04-13", bookings: 722, cancellations: 48 },
  { date: "2024-04-14", bookings: 357, cancellations: 26 },
  { date: "2024-04-15", bookings: 290, cancellations: 21 },
  { date: "2024-04-16", bookings: 328, cancellations: 24 },
  { date: "2024-04-17", bookings: 806, cancellations: 53 },
  { date: "2024-04-18", bookings: 774, cancellations: 49 },
  { date: "2024-04-19", bookings: 423, cancellations: 28 },
  { date: "2024-04-20", bookings: 239, cancellations: 18 },
  { date: "2024-04-21", bookings: 337, cancellations: 25 },
  { date: "2024-04-22", bookings: 394, cancellations: 27 },
  { date: "2024-04-23", bookings: 368, cancellations: 26 },
  { date: "2024-04-24", bookings: 677, cancellations: 42 },
  { date: "2024-04-25", bookings: 465, cancellations: 31 },
  { date: "2024-04-26", bookings: 205, cancellations: 15 },
  { date: "2024-04-27", bookings: 803, cancellations: 54 },
  { date: "2024-04-28", bookings: 302, cancellations: 22 },
  { date: "2024-04-29", bookings: 555, cancellations: 37 },
  { date: "2024-04-30", bookings: 834, cancellations: 56 },
  { date: "2024-05-01", bookings: 385, cancellations: 28 },
  { date: "2024-05-02", bookings: 603, cancellations: 41 },
  { date: "2024-05-03", bookings: 437, cancellations: 30 },
  { date: "2024-05-04", bookings: 805, cancellations: 53 },
  { date: "2024-05-05", bookings: 871, cancellations: 58 },
  { date: "2024-05-06", bookings: 1018, cancellations: 68 },
  { date: "2024-05-07", bookings: 688, cancellations: 46 },
  { date: "2024-05-08", bookings: 359, cancellations: 25 },
  { date: "2024-05-09", bookings: 407, cancellations: 28 },
  { date: "2024-05-10", bookings: 623, cancellations: 42 },
  { date: "2024-05-11", bookings: 605, cancellations: 40 },
  { date: "2024-05-12", bookings: 437, cancellations: 29 },
  { date: "2024-05-13", bookings: 357, cancellations: 24 },
  { date: "2024-05-14", bookings: 938, cancellations: 62 },
  { date: "2024-05-15", bookings: 853, cancellations: 57 },
  { date: "2024-05-16", bookings: 738, cancellations: 49 },
  { date: "2024-05-17", bookings: 919, cancellations: 61 },
  { date: "2024-05-18", bookings: 665, cancellations: 44 },
  { date: "2024-05-19", bookings: 415, cancellations: 28 },
  { date: "2024-05-20", bookings: 407, cancellations: 27 },
  { date: "2024-05-21", bookings: 222, cancellations: 16 },
  { date: "2024-05-22", bookings: 201, cancellations: 14 },
  { date: "2024-05-23", bookings: 542, cancellations: 36 },
  { date: "2024-05-24", bookings: 514, cancellations: 34 },
  { date: "2024-05-25", bookings: 451, cancellations: 30 },
  { date: "2024-05-26", bookings: 383, cancellations: 26 },
  { date: "2024-05-27", bookings: 880, cancellations: 59 },
  { date: "2024-05-28", bookings: 423, cancellations: 28 },
  { date: "2024-05-29", bookings: 208, cancellations: 15 },
  { date: "2024-05-30", bookings: 620, cancellations: 41 },
  { date: "2024-05-31", bookings: 408, cancellations: 27 },
  { date: "2024-06-01", bookings: 378, cancellations: 25 },
  { date: "2024-06-02", bookings: 880, cancellations: 59 },
  { date: "2024-06-03", bookings: 263, cancellations: 18 },
  { date: "2024-06-04", bookings: 819, cancellations: 55 },
  { date: "2024-06-05", bookings: 228, cancellations: 16 },
  { date: "2024-06-06", bookings: 544, cancellations: 36 },
  { date: "2024-06-07", bookings: 693, cancellations: 46 },
  { date: "2024-06-08", bookings: 705, cancellations: 47 },
  { date: "2024-06-09", bookings: 918, cancellations: 61 },
  { date: "2024-06-10", bookings: 355, cancellations: 24 },
  { date: "2024-06-11", bookings: 242, cancellations: 17 },
  { date: "2024-06-12", bookings: 912, cancellations: 61 },
  { date: "2024-06-13", bookings: 211, cancellations: 15 },
  { date: "2024-06-14", bookings: 806, cancellations: 54 },
  { date: "2024-06-15", bookings: 657, cancellations: 44 },
  { date: "2024-06-16", bookings: 681, cancellations: 45 },
  { date: "2024-06-17", bookings: 995, cancellations: 66 },
  { date: "2024-06-18", bookings: 277, cancellations: 19 },
  { date: "2024-06-19", bookings: 630, cancellations: 42 },
  { date: "2024-06-20", bookings: 858, cancellations: 57 },
  { date: "2024-06-21", bookings: 379, cancellations: 25 },
  { date: "2024-06-22", bookings: 587, cancellations: 39 },
  { date: "2024-06-23", bookings: 1010, cancellations: 67 },
  { date: "2024-06-24", bookings: 312, cancellations: 21 },
  { date: "2024-06-25", bookings: 331, cancellations: 22 },
  { date: "2024-06-26", bookings: 814, cancellations: 54 },
  { date: "2024-06-27", bookings: 938, cancellations: 62 },
  { date: "2024-06-28", bookings: 349, cancellations: 23 },
  { date: "2024-06-29", bookings: 263, cancellations: 18 },
  { date: "2024-06-30", bookings: 846, cancellations: 56 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(221, 83%, 53%)", // Blue-600
  },
  cancellations: {
    label: "Cancellations",
    color: "hsl(0, 72%, 51%)", // Red-600
  },
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = bookingData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Calculate summary stats
  const totalBookings = filteredData.reduce((sum, item) => sum + item.bookings, 0);
  const totalCancellations = filteredData.reduce((sum, item) => sum + item.cancellations, 0);
  const cancellationRate = ((totalCancellations / totalBookings) * 100).toFixed(1);
  const trend = filteredData.length > 1 ? 
    (filteredData[filteredData.length - 1].bookings - filteredData[0].bookings) / filteredData[0].bookings * 100 : 0;

  return (
    <Card className="@container/card bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Booking Analytics
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              <span className="@[540px]/card:block hidden">
                Tracking bookings and cancellations
              </span>
              <span className="@[540px]/card:hidden">Booking trends</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
            <div className="absolute right-4 top-4">
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="@[767px]/card:flex hidden"
              >
                <ToggleGroupItem value="90d" className="h-8 px-2.5">
                  3M
                </ToggleGroupItem>
                <ToggleGroupItem value="30d" className="h-8 px-2.5">
                  1M
                </ToggleGroupItem>
                <ToggleGroupItem value="7d" className="h-8 px-2.5">
                  7D
                </ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="@[767px]/card:hidden flex w-24"
                  aria-label="Select time range"
                >
                  <SelectValue placeholder="3M" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                Total Bookings
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-900 dark:text-white">
              {totalBookings.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600 dark:text-red-300" />
              <span className="text-sm font-medium text-red-600 dark:text-red-300">
                Cancellation Rate
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-red-900 dark:text-white">
              {cancellationRate}%
            </div>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCancellations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="bookings"
              type="monotone"
              fill="url(#fillBookings)"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area
              dataKey="cancellations"
              type="monotone"
              fill="url(#fillCancellations)"
              stroke="#ef4444"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}