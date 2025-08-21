import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <div className="space-y-6">
      {/* Loading Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading Search Bar */}
      <Card className="border-0 shadow-elegant">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 flex-1 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-full sm:w-48 bg-muted animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Loading Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-elegant">
            <CardContent className="p-0">
              <div className="aspect-[3/4] w-full bg-muted animate-pulse rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div>
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <div className="h-8 flex-1 bg-muted animate-pulse rounded" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
