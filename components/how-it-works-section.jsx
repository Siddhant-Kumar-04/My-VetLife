import { CheckCircle, Users, Heart, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HowItWorksSection() {
  const highlights = [
    {
      icon: Award,
      title: "Over 10 years of experience",
    },
    {
      icon: Users,
      title: "All Vets are ready to help you",
    },
    {
      icon: CheckCircle,
      title: "High skilled & qualified only",
    },
    {
      icon: Heart,
      title: "Regular Veterinary Checkups",
    },
  ]

  return (
    <section className="bg-muted/20 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-linear-to-br from-accent/40 to-primary/20">
              <div className="absolute inset-0 flex items-center justify-center\">
                <div className="text-center p-8">
                  <div className="h-48 w-48 mx-auto rounded-full bg-white shadow-2xl flex items-center justify-center">
                    <Heart className="h-24 w-24 text-primary" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-foreground">Caring for Pets</h3>
                  <p className="mt-2 text-muted-foreground">With Love & Expertise</p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-accent/50 -z-10" />
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">About Us</p>
              <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
                Our Journey To VetLife
              </h2>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                A Passion For Pet Care
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                VetLife was born out of a deep commitment to delivering quality veterinary care right at your doorstep. We understand that pets are family, and they deserve the best care without the stress of clinic visits.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8">
                <Link href="/about">More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
