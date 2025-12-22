import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CouponsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-5 w-[280px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[130px]" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-[280px]" />
        <Skeleton className="h-10 w-[160px]" />
        <Skeleton className="h-10 w-[140px]" />
      </div>

      {/* Table */}
      <Card>
        <div className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
