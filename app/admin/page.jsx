"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Shield,
  Bell,
  Settings,
  LogOut,
  User,
  BarChart3,
} from "lucide-react"

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const stats = [
    { label: "Total Users", value: "10,248", icon: Users, trend: "+256 this month", color: "text-blue-500" },
    { label: "Verified Doctors", value: "512", icon: Stethoscope, trend: "+28 this month", color: "text-primary" },
    { label: "Total Appointments", value: "52,847", icon: Calendar, trend: "+1,247 this month", color: "text-accent" },
    { label: "Revenue", value: "$125,480", icon: DollarSign, trend: "+18% vs last month", color: "text-green-500" },
  ]

  const pendingDoctors = [
    { id: 1, name: "Dr. Robert Lee", specialty: "Canine Surgery", qualification: "DVM, DACVS", applied: "Jan 22, 2026" },
    { id: 2, name: "Dr. Amanda White", specialty: "Feline Medicine", qualification: "DVM, ABVP", applied: "Jan 21, 2026" },
    { id: 3, name: "Dr. James Carter", specialty: "Emergency Care", qualification: "DVM, DACVECC", applied: "Jan 20, 2026" },
  ]

  const recentAppointments = [
    { id: 1, doctor: "Dr. Sarah Wilson", patient: "Max (Golden Retriever)", owner: "John Doe", date: "Jan 24, 2026", status: "completed", amount: "$75" },
    { id: 2, doctor: "Dr. Michael Chen", patient: "Luna (Persian Cat)", owner: "Sarah Smith", date: "Jan 24, 2026", status: "confirmed", amount: "$90" },
    { id: 3, doctor: "Dr. Emily Rodriguez", patient: "Buddy (Labrador)", owner: "Mike Johnson", date: "Jan 24, 2026", status: "pending", amount: "$80" },
    { id: 4, doctor: "Dr. James Brown", patient: "Whiskers (Siamese)", owner: "Emily Brown", date: "Jan 23, 2026", status: "completed", amount: "$120" },
    { id: 5, doctor: "Dr. Lisa Park", patient: "Charlie (Beagle)", owner: "Tom Wilson", date: "Jan 23, 2026", status: "cancelled", amount: "$95" },
  ]

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", pets: 3, appointments: 12, joined: "Nov 15, 2025" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", pets: 2, appointments: 8, joined: "Dec 1, 2025" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", pets: 1, appointments: 5, joined: "Dec 20, 2025" },
    { id: 4, name: "Emily Brown", email: "emily@example.com", pets: 4, appointments: 15, joined: "Oct 5, 2025" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-primary/10 text-primary"
      case "confirmed": return "bg-blue-500/10 text-blue-500"
      case "pending": return "bg-accent text-accent-foreground"
      case "cancelled": return "bg-destructive/10 text-destructive"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Vetic</span>
            <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <Shield className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="hidden md:block">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the Vetic platform</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Doctor Verifications */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Pending Verifications
              </CardTitle>
              <CardDescription>Doctor applications awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingDoctors.map((doctor) => (
                <div key={doctor.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                      <p className="text-xs text-muted-foreground mt-1">Applied: {doctor.applied}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Appointments
                  </CardTitle>
                  <CardDescription>Latest platform activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.doctor}</TableCell>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{appointment.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="owners">
              <TabsList>
                <TabsTrigger value="owners">Pet Owners</TabsTrigger>
                <TabsTrigger value="doctors">Doctors</TabsTrigger>
              </TabsList>
              <TabsContent value="owners" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Pets</TableHead>
                      <TableHead>Appointments</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.pets}</TableCell>
                        <TableCell>{user.appointments}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>View Activity</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="doctors" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Consultations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Stethoscope className="h-4 w-4 text-primary" />
                          </div>
                          Dr. Sarah Wilson
                        </div>
                      </TableCell>
                      <TableCell>General Veterinarian</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          4.9 <span className="text-accent">&#9733;</span>
                        </span>
                      </TableCell>
                      <TableCell>124</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Verified
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>View Earnings</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Suspend Doctor</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
