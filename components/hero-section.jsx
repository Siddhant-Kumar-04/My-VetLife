import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent/40 py-16 lg:py-24">
      {/* Decorative elements */}
      <div className="absolute top-10 right-20 h-16 w-16 rounded-full bg-accent/30 animate-float" />
      <div className="absolute bottom-20 left-10 h-12 w-12 rounded-full bg-primary/20 animate-float-slow" />
      <div className="absolute top-1/3 right-1/4 text-6xl text-accent/20 animate-float">🐾</div>
      <div className="absolute bottom-1/4 right-10 text-5xl text-accent/20 animate-float-slow">🐾</div>
      <div className="absolute top-1/2 left-1/4 text-4xl text-accent/15 animate-float" style={{ animationDelay: '1s' }}>🐾</div>
      <div className="absolute bottom-1/3 left-1/3 h-10 w-10 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '0.5s' }} />
      
      {/* Floating Bone Decorations */}
      <div className="absolute top-1/4 left-1/3 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.3s' }}>🦴</div>
      <div className="absolute bottom-1/3 right-1/3 text-4xl opacity-15 animate-float-slow" style={{ animationDelay: '1.2s' }}>🦴</div>
      
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-lg font-bold text-primary tracking-wide" style={{ fontFamily: 'var(--font-dancing)' }}>Welcome To Vetic</p>
              <h1 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl">
                The Best Care For{" "}
                <span className="block mt-1">Your Best Friend</span>
              </h1>
            </div>
            
            <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
              Connect with qualified veterinarians for home consultations. No more stressful clinic visits for your beloved pets.
            </p>

            <div>
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8">
                <Link href="/doctors">
                  Our Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Orbiting pet silhouettes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Dog silhouette */}
                <div className="absolute animate-orbit" style={{ animationDelay: '0s' }}>
                  <svg className="w-8 h-8 text-primary opacity-[0.07]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 6.5c-.38 0-.72.24-.88.59L16.5 8.5l-3-1.5c-.33-.17-.67-.17-1 0l-3 1.5-.62-1.41c-.16-.35-.5-.59-.88-.59-1.1 0-2 .9-2 2s.9 2 2 2h12c1.1 0 2-.9 2-2s-.9-2-2-2zM5 13c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2zm-7 0c-1.66 0-3 1.34-3 3v3c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3c0-1.66-1.34-3-3-3z"/>
                  </svg>
                </div>
                {/* Cat silhouette */}
                <div className="absolute animate-orbit" style={{ animationDelay: '7.5s' }}>
                  <svg className="w-8 h-8 text-primary opacity-[0.07]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-5h-3.18C15.4 1.84 14.3 1 13 1c-1.3 0-2.4.84-2.82 2H7c-.55 0-1 .45-1 1 0 .55.45 1 1 1 0 2.21 1.79 4 4 4h2c2.21 0 4-1.79 4-4 0-.55.45-1 1-1s1-.45 1-1-.45-1-1-1zm-9 9c-3.31 0-6 2.69-6 6v2c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2c0-3.31-2.69-6-6-6h-4z"/>
                  </svg>
                </div>
              </div>
              {/* Circular border */}
              <div className="absolute inset-0 rounded-full border-4 border-white/80 shadow-2xl animate-rotate-slow" />
              <div className="absolute inset-2 rounded-full overflow-hidden bg-white">
                <div className="flex h-full items-center justify-center bg-linear-to-br from-accent/30 to-primary/20">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="h-32 w-32 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Shield className="h-16 w-16 text-primary animate-pulse-slow" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Professional Care</h3>
                    <p className="text-muted-foreground mt-2">For Your Beloved Pets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave SVG at bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
