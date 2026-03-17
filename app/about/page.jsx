import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  Shield,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We believe every pet deserves loving, gentle care from veterinarians who truly understand their needs.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "All our veterinarians are thoroughly verified, licensed, and committed to the highest standards of care.",
    },
    {
      icon: Clock,
      title: "Convenience First",
      description: "We bring quality veterinary care to your doorstep, eliminating the stress of clinic visits for you and your pets.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain rigorous quality standards and continuously improve our services based on feedback.",
    },
  ]

  const team = [
    {
      name: "Dr. Amanda Foster",
      role: "Founder & CEO",
      bio: "Veterinarian with 15 years of experience, passionate about making pet healthcare accessible to all.",
    },
    {
      name: "Michael Chang",
      role: "Chief Technology Officer",
      bio: "Tech innovator dedicated to building seamless digital experiences for pet owners and veterinarians.",
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Veterinary Services",
      bio: "Oversees our network of 500+ verified veterinarians and ensures quality care standards.",
    },
    {
      name: "Dr. James Rodriguez",
      role: "Medical Director",
      bio: "Board-certified veterinarian specializing in emergency care and preventive medicine.",
    },
  ]

  const milestones = [
    { year: "2022", title: "Founded", description: "Vetic was founded with a mission to transform pet healthcare" },
    { year: "2023", title: "100 Doctors", description: "Reached 100 verified veterinarians on our platform" },
    { year: "2024", title: "50K Consultations", description: "Completed 50,000 home consultations across the country" },
    { year: "2025", title: "500+ Doctors", description: "Expanded to 500+ verified vets serving 10,000+ pet owners" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-linear-to-b from-primary/5 to-background py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-foreground lg:text-5xl text-balance">
                Bringing Quality Pet Care to Your{" "}
                <span className="text-primary">Doorstep</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Vetic at Home was founded with a simple mission: to make professional veterinary care accessible, convenient, and stress-free for pets and their owners. We connect you with verified veterinarians who come to your home.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/doctors">
                    Find a Veterinarian <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/register">Join Our Network</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">10,000+</p>
                <p className="mt-1 text-sm text-muted-foreground">Happy Pet Owners</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">500+</p>
                <p className="mt-1 text-sm text-muted-foreground">Verified Vets</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">50,000+</p>
                <p className="mt-1 text-sm text-muted-foreground">Consultations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">4.9</p>
                <p className="mt-1 text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Our Story</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Vetic at Home was born from a simple observation: taking pets to the vet is often stressful for both animals and their owners. Long waits, anxious car rides, and unfamiliar environments can make routine checkups feel overwhelming.
                  </p>
                  <p>
                    Our founder, Dr. Amanda Foster, experienced this firsthand when her own elderly dog became too anxious for clinic visits. She realized there had to be a better way to provide quality veterinary care.
                  </p>
                  <p>
                    In 2022, Vetic at Home launched with a handful of dedicated veterinarians committed to bringing compassionate care directly to homes. Today, we've grown to serve thousands of pet families across the country.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 p-8">
                  <div className="flex h-full flex-col items-center justify-center rounded-xl bg-card shadow-lg p-8">
                    <Heart className="h-20 w-20 text-primary mb-4" />
                    <p className="text-center text-lg font-semibold text-foreground">
                      "Every pet deserves quality care in a comfortable environment."
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">- Dr. Amanda Foster, Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Our Journey</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Key milestones in our mission to transform pet healthcare
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative">
                  {index < milestones.length - 1 && (
                    <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border lg:block" />
                  )}
                  <div className="relative rounded-2xl border border-border bg-card p-6 text-center">
                    <span className="inline-block rounded-full bg-primary px-4 py-2 text-lg font-bold text-primary-foreground">
                      {milestone.year}
                    </span>
                    <h3 className="mt-4 font-semibold text-foreground">{milestone.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-muted/30 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Meet Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The people behind Vetic at Home
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <Card key={member.name}>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Get in Touch</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Have questions? We'd love to hear from you
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center pt-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    123 Pet Care Avenue<br />
                    New York, NY 10001
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center pt-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    +1 (555) 123-4567<br />
                    Mon - Sun: 8AM - 10PM
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center pt-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    support@vetic.com<br />
                    vetic-at-home@vetic.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-20">
          <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
            <h2 className="text-3xl font-bold text-primary-foreground lg:text-4xl text-balance">
              Ready to Experience Better Pet Care?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of pet owners who trust Vetic-At-Home for convenient, quality veterinary care at home.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                <Link href="/doctors">Browse Doctors</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
