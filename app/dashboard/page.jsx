import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dog, Calendar, Clock, Star, ArrowRight, Plus } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    { label: "My Pets", value: "3", icon: Dog, href: "/dashboard/pets" },
    { label: "Upcoming", value: "2", icon: Calendar, href: "/dashboard/appointments" },
    { label: "Completed", value: "12", icon: Clock, href: "/dashboard/history" },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Wilson",
      specialty: "General Vet",
      pet: "Max (Golden Retriever)",
      date: "Jan 25, 2026",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Feline Specialist",
      pet: "Luna (Persian Cat)",
      date: "Jan 28, 2026",
      time: "2:30 PM",
      status: "pending",
    },
  ]

  const pets = [
    { id: 1, name: "Max", type: "Dog", breed: "Golden Retriever", age: "3 years" },
    { id: 2, name: "Luna", type: "Cat", breed: "Persian", age: "2 years" },
    { id: 3, name: "Buddy", type: "Dog", breed: "Labrador", age: "5 years" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground">Manage your pets and appointments</p>
        </div>
        <Button asChild>
          <Link href="/doctors">
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/appointments" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{appointment.pet}</span>
                    <span>{appointment.date}</span>
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Pets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Pets</CardTitle>
              <CardDescription>Your registered pets</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pets" className="gap-1">
                Manage <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50">
                  <Dog className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{pet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed} - {pet.age}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="bg-transparent">
                  <Link href={`/dashboard/pets/${pet.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/doctors">
                <Calendar className="h-6 w-6 text-primary" />
                <span>Book Consultation</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/dashboard/pets">
                <Plus className="h-6 w-6 text-primary" />
                <span>Add New Pet</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/dashboard/history">
                <Clock className="h-6 w-6 text-primary" />
                <span>View History</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
              <Link href="/dashboard/appointments">
                <Star className="h-6 w-6 text-primary" />
                <span>Rate Doctor</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
