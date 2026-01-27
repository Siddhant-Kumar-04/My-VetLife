import Link from "next/link"
import { Stethoscope } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Vetic</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bringing quality pet healthcare to your doorstep. Connect with qualified veterinarians for home consultations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home Consultation
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Emergency Care
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Vaccination
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Health Checkups
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                support@vetic.com
              </li>
              <li className="text-sm text-muted-foreground">
                +1 (555) 123-4567
              </li>
              <li className="text-sm text-muted-foreground">
                Mon - Sun: 8AM - 10PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} Vetic at Home. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
