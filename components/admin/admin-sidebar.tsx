"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  BarChart3,
  FileText,
  Briefcase,
  Wrench,
  User,
  Settings,
  LogOut,
  Database,
  FolderKanban,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const routes = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/admin",
    pattern: /^\/admin$/,
  },
  {
    label: "Blog Posts",
    icon: FileText,
    href: "/admin/posts",
    pattern: /^\/admin\/posts/,
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/admin/projects",
    pattern: /^\/admin\/projects/,
  },
  {
    label: "Experience",
    icon: Briefcase,
    href: "/admin/experience",
    pattern: /^\/admin\/experience/,
  },
  {
    label: "Skills",
    icon: Wrench,
    href: "/admin/skills",
    pattern: /^\/admin\/skills/,
  },
  {
    label: "About Page",
    icon: User,
    href: "/admin/about",
    pattern: /^\/admin\/about/,
  },
  {
    label: "Newsletter",
    icon: Mail,
    href: "/admin/newsletter",
    pattern: /^\/admin\/newsletter/,
  },
  {
    label: "Database Check",
    icon: Database,
    href: "/admin/database-check",
    pattern: /^\/admin\/database-check/,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    pattern: /^\/admin\/settings/,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                route.pattern.test(pathname) && "bg-muted text-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </div>
    </div>
  )
}
