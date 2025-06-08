// filepath: /Users/esmaeilabedi/personal/personal-website-1/app/blog/loading.tsx
export default function Loading() {
  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            My Blog
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Thoughts, ideas, and insights on software development, design, and
            more.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-8">
        {/* You can add skeleton loaders for category buttons if desired */}
        <div className="h-8 w-16 rounded-md bg-muted animate-pulse"></div>
        <div className="h-8 w-24 rounded-md bg-muted animate-pulse"></div>
        <div className="h-8 w-20 rounded-md bg-muted animate-pulse"></div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
        {/* Skeleton for posts */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg border bg-background p-4"
          >
            <div className="overflow-hidden rounded-lg aspect-video bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse"></div>
              <div className="h-3 w-full rounded bg-muted animate-pulse"></div>
              <div className="h-3 w-5/6 rounded bg-muted animate-pulse"></div>
              <div className="flex justify-between items-center mt-1">
                <div className="h-3 w-1/4 rounded bg-muted animate-pulse"></div>
                <div className="h-3 w-1/4 rounded bg-muted animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
