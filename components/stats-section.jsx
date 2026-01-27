export function StatsSection() {
  const stats = [
    { value: "10,000+", label: "Happy Pet Owners" },
    { value: "500+", label: "Verified Doctors" },
    { value: "50,000+", label: "Consultations" },
    { value: "4.9", label: "Average Rating" },
  ]

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
