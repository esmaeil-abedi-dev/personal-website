"use client";

import { Suspense } from "react";
// If you plan to add navigation elements, import them here
// import Link from 'next/link';
// import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    // Wrap the main content of your NotFound page in a Suspense boundary.
    // This ensures that if any part of this client component's tree
    // (or Next.js internals related to rendering it) uses useSearchParams,
    // it's properly handled.
    <Suspense
      fallback={
        <main className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-md text-center">
            <p>Loading...</p>
          </div>
        </main>
      }
    >
      <main className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
          <p className="text-muted-foreground mt-4">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          {/* Example of adding a link back home, which would also be covered by Suspense
          <div className="mt-8">
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
          */}
        </div>
      </main>
    </Suspense>
  );
}
