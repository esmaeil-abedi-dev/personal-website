"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Settings } from "lucide-react"
import { useState, Suspense } from "react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search } from "@/components/search"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
    {
      href: "/experience",
      label: "Experience",
      active: pathname === "/experience",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      active: pathname === "/portfolio" || pathname.startsWith("/portfolio/"),
    },
    {
      href: "/blog",
      label: "Blog",
      active: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold">
            John Doe
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={null}>
            <Search />
          </Suspense>
          {status === "authenticated" && session && (
            <Link href="/admin">
              <Button variant="ghost" size="icon" title="Admin Panel">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Admin</span>
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col gap-4 pb-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            {status === "authenticated" && session && (
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
