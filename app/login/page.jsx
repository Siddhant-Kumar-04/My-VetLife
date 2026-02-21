"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already logged in (only after auth check completes)
  useEffect(() => {
    if (authLoading) return
    if (isAuthenticated && user) {
      if (user.role === "owner") {
        router.push("/dashboard")
      } else if (user.role === "doctor") {
        router.push("/doctor-dashboard")
      } else if (user.role === "admin") {
        router.push("/admin")
      }
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await login(formData)
      
      // Route based on user role
      if (response.user.role === "owner") {
        router.push("/dashboard")
      } else if (response.user.role === "doctor") {
        router.push("/doctor-dashboard")
      } else if (response.user.role === "admin") {
        router.push("/admin")
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Vetic</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden flex-1 bg-primary lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/10">
            <Stethoscope className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground">
            Quality Pet Care at Home
          </h2>
          <p className="mt-4 text-primary-foreground/80 leading-relaxed">
            Connect with qualified veterinarians and get the best care for your furry friends without leaving your home.
          </p>
        </div>
      </div>
    </div>
  )
}
