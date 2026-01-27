import { Search, CalendarCheck, Home, Heart } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Search & Filter",
      description: "Find veterinarians by specialization, location, ratings, and availability.",
    },
    {
      icon: CalendarCheck,
      step: "02",
      title: "Book Appointment",
      description: "Select a convenient date and time slot for your home consultation.",
    },
    {
      icon: Home,
      step: "03",
      title: "Home Visit",
      description: "The veterinarian visits your home to examine and treat your pet.",
    },
    {
      icon: Heart,
      step: "04",
      title: "Follow-up Care",
      description: "Get prescriptions, health records, and schedule follow-up visits easily.",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting quality pet care at home is simple with Vetic
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.title} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}
              
              {/* Step Circle */}
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/10" />
                <div className="absolute inset-2 rounded-full bg-card shadow-md" />
                <item.icon className="relative h-10 w-10 text-primary" />
              </div>
              
              <span className="mb-2 inline-block text-sm font-bold text-primary">
                Step {item.step}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
