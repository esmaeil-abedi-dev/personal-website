export default function Loading() {
  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="h-10 w-3/4 mx-auto bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/2 mx-auto bg-muted rounded animate-pulse"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Skeleton for Contact Information Card */}
          <div className="rounded-lg border bg-background p-6 space-y-4 animate-pulse">
            <div className="h-6 w-1/2 bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted rounded-full"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            </div>
          </div>

          {/* Skeleton for Send a Message Card */}
          <div className="rounded-lg border bg-background p-6 space-y-4 animate-pulse">
            <div className="h-6 w-1/2 bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="space-y-4 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-4 w-1/4 bg-muted rounded"></div>
                  <div className="h-10 w-full bg-muted rounded"></div>
                </div>
              ))}
              <div className="h-10 w-full bg-primary/50 rounded mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
