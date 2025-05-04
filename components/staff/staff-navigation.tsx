"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { logout } from "@/lib/cookies"
import { useRouter } from "next/navigation"
export function StaffNavigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      name: "Staff Management",
      href: "/admin/staff",
      active: pathname === "/admin/staff",
    },
    {
      name: "Workload",
      href: "/admin/staff/workload",
      active: pathname.startsWith("/admin/staff/workload"),
    },
    {
      name: "Schedule",
      href: "/admin/staff/schedule",
      active: pathname.startsWith("/admin/staff/schedule"),
    },
  ]

  const router = useRouter();
      const handleLogout = async () => {
        try {
          await logout()
          router.push("/auth") // Redirect to login page
        } catch (error) {
          console.error("Logout error:", error)
        }
      }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex justify-between h-14 items-center px-8">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Hospital Management</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  route.active ? "text-foreground font-bold" : "text-foreground/60",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex flex-1 items-center justify-end">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "block py-2 px-3 text-base font-medium rounded-md",
                  route.active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {route.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
