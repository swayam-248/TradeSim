"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">TradePro</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/analytics"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/analytics" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Analytics
        </Link>
        <Link
          href="/graphs"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/graphs" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Graphs
        </Link>
        <Link
          href="/deposit"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/deposit" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Deposit
        </Link>
      </nav>
    </div>
  )
}
