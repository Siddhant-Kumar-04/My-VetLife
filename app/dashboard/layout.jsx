"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/header"
import { useAuth } from "@/lib/AuthContext"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {x
        router.push("/login")
        return
      }

      // Role-based access control
      if (user?.role === "doctor") {
        router.push("/doctor-dashboard")
      } else if (user?.role === "admin") {
        router.push("/admin")
      } else if (user?.role !== "owner") {
        // If user has no valid role, redirect to home
        router.push("/")
      }
    }
  }, [user, loading, isAuthenticated, router])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render dashboard if user is not authenticated or not an owner
  if (!isAuthenticated || user?.role !== "owner") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
