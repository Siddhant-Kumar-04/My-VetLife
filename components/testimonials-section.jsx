import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Dog Owner",
      content: "Vetic-At-Home made it so easy to get my anxious pup the care he needed without the stress of a clinic visit. The vet was professional and caring.",
      rating: 5,
      pet: "Golden Retriever",
    },
    {
      name: "Michael Chen",
      role: "Cat Owner",
      content: "Finding a vet who specializes in feline care was a breeze. My cat received excellent treatment at home. Highly recommended!",
      rating: 5,
      pet: "Persian Cat",
    },
    {
      name: "Emily Rodriguez",
      role: "Multi-pet Owner",
      content: "Managing appointments for all my pets is now so simple. The health records feature is incredibly useful for keeping track of vaccinations.",
      rating: 5,
      pet: "3 Dogs, 2 Cats",
    },
  ]

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            Loved by Pet Owners
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our community has to say about their experience
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-border bg-card p-6"
            >
              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              
              {/* Content */}
              <p className="mb-6 text-foreground leading-relaxed">
                {`"${testimonial.content}"`}
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
