import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Trusted by 10,000+ Pet Owners
            </div>
            
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl text-balance">
              Expert Pet Care,{" "}
              <span className="text-primary">Right at Your Doorstep</span>
            </h1>
            
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              Connect with qualified veterinarians for home consultations. No more stressful clinic visits for your beloved pets. Quality healthcare made convenient.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/doctors">
                  Book Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href="/register">Join as Doctor</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">4.9 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Verified Doctors</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="absolute inset-4 rounded-2xl bg-card shadow-2xl overflow-hidden">
                <div className="flex h-full flex-col items-center justify-center p-8">
                  <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-20 w-20 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold text-foreground">Caring for Pets</h3>
                    <p className="text-sm text-muted-foreground">Professional veterinary care at home</p>
                  </div>
                  
                  {/* Floating Cards */}
                  <div className="absolute -left-4 top-1/4 rounded-xl bg-card p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">500+</p>
                        <p className="text-xs text-muted-foreground">Verified Vets</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -right-4 bottom-1/4 rounded-xl bg-card p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">10 min</p>
                        <p className="text-xs text-muted-foreground">Avg. Response</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
