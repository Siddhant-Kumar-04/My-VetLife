"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Loader2 } from "lucide-react"

export default function DoctorDashboardLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Role-based access control - only doctors can access
      if (user?.role === "owner") {
        router.push("/dashboard")
      } else if (user?.role === "admin") {
        router.push("/admin")
      } else if (user?.role !== "doctor") {
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

  // Don't render dashboard if user is not authenticated or not a doctor
  if (!isAuthenticated || user?.role !== "doctor") {
    return null
  }

  return <>{children}</>
}
