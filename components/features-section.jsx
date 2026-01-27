import { Home, Calendar, FileText, Star, Shield, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Home,
      title: "Home Consultations",
      description: "Get professional veterinary care without leaving your home. Reduce stress for your pets.",
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments at your convenience. Choose from available time slots that work for you.",
    },
    {
      icon: FileText,
      title: "Pet Health Records",
      description: "Maintain complete digital health records for all your pets in one secure place.",
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read genuine reviews from pet owners to choose the best veterinarian for your pet.",
    },
    {
      icon: Shield,
      title: "Qualified Doctors",
      description: "All veterinarians are verified with proper qualifications and experience.",
    },
    {
      icon: Clock,
      title: "Emergency Support",
      description: "Access urgent care services when your pet needs immediate attention.",
    },
  ]

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            Everything Your Pet Needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive pet healthcare services designed for convenience and quality care
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
