import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FeaturesSection() {
  const features = [
    {
      image: "/dog.png",
      title: "Dog Care",
      description: "Complete health care for your canine companions with expert veterinarians.",
      color: "from-orange-100 to-orange-50",
      iconBg: "bg-orange-100",
    },
    {
      image: "/cat.png",
      title: "Cat Care",
      description: "Specialized feline health services from qualified veterinary professionals.",
      color: "from-pink-100 to-pink-50",
      iconBg: "bg-pink-100",
    },
    
    {
      image: "/veterinary.png",
      title: "Veterinary",
      description: "Expert medical care for all your pet health needs and emergencies.",
      color: "from-green-100 to-green-50",
      iconBg: "bg-green-100",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Our Services</p>
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
            All Pet Care Services
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-3xl bg-linear-to-br ${feature.color} p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1`}
            >
              <div className={`mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${feature.iconBg} transition-transform group-hover:scale-110`}>
                <Image 
                  src={feature.image} 
                  alt={feature.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8">
            <Link href="/doctors">See All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
