import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-3xl font-bold text-primary-foreground lg:text-4xl text-balance">
          Ready to Give Your Pet the Best Care?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
          Join thousands of pet owners who trust Vetic for convenient, quality veterinary care at home.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" asChild className="gap-2">
            <Link href="/register">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
            <Link href="/doctors">Browse Doctors</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
