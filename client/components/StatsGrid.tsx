import { Book, Users, TrendingUp, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StatsResponse } from "@shared/api";

interface StatsGridProps {
  stats: StatsResponse;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statsItems = [
    {
      icon: Book,
      label: "Total Books",
      value: stats.totalBooks,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Users,
      label: "Authors",
      value: stats.totalAuthors,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: TrendingUp,
      label: "Genres",
      value: stats.totalGenres,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: stats.averageRating.toFixed(1),
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((item, index) => (
        <Card key={index} className="border-0 shadow-elegant animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bgColor}`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
