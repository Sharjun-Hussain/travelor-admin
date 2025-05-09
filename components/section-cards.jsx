import { TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, DollarSign, Hotel, Users } from "lucide-react";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {/* Bookings Today - Blue */}
      <Card className="@container/card bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            <CardDescription className="text-blue-600 dark:text-blue-300">Bookings Today</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-blue-900 dark:text-white">
            1,245
          </CardTitle>
          {/* <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              <TrendingUpIcon className="size-3" />
              +18.2%
            </Badge>
          </div> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1 text-sm text-blue-700 dark:text-blue-200">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peak season surge <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Compared to yesterday
          </div>
        </CardFooter> */}
      </Card>

      {/* Total Revenue - Green */}
      <Card className="@container/card bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
            <CardDescription className="text-green-600 dark:text-green-300">Total Revenue</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-green-900 dark:text-white">
            $84,560
          </CardTitle>
          {/* <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              <TrendingUpIcon className="size-3" />
              +22.7%
            </Badge>
          </div> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1 text-sm text-green-700 dark:text-green-200">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Record daily revenue <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Includes all currencies
          </div>
        </CardFooter> */}
      </Card>

      {/* Active Listings - Purple */}
      <Card className="@container/card bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            <CardDescription className="text-purple-600 dark:text-purple-300">Active Listings</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-purple-900 dark:text-white">
            5,432
          </CardTitle>
          {/* <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
              <TrendingUpIcon className="size-3" />
              +8.1%
            </Badge>
          </div> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1 text-sm text-purple-700 dark:text-purple-200">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Healthy inventory growth <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            New listings today: 34
          </div>
        </CardFooter> */}
      </Card>

      {/* New Users - Amber */}
      <Card className="@container/card bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600 dark:text-amber-300" />
            <CardDescription className="text-amber-600 dark:text-amber-300">New Users</CardDescription>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-amber-900 dark:text-white">
            1,087
          </CardTitle>
          {/* <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
              <TrendingUpIcon className="size-3" />
              +9.8%
            </Badge>
          </div> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1 text-sm text-amber-700 dark:text-amber-200">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Organic growth <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mobile signups: 68%
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}