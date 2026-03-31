import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Crown className="h-4 w-4 text-accent" />
            Luxury Stay in Barara
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground">
            Welcome to <span className="text-primary">Royal Plaza</span> Hotels
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience premium comfort and elegance at Sadhaura Road, Barara, Ambala. Perfect for families, couples, and events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-base">
              <Link to="/register">Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5 px-8 text-base">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-foreground">
            Why Choose <span className="text-accent">Royal Plaza</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Premium Rooms",
                desc: "Spacious AC rooms with modern amenities and comfortable furnishings.",
              },
              {
                icon: Crown,
                title: "Luxury Experience",
                desc: "Elegant interiors with swimming pool, restaurant, and banquet hall.",
              },
              {
                icon: Sparkles,
                title: "Perfect Location",
                desc: "Near Dhanaura Bus Stand and Prachin Hanuman Mandir, easy to reach.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-8 text-center space-y-4 hover:shadow-lg hover:border-accent/30 transition-all duration-300"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-card-foreground">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-heading font-bold text-foreground">
            Ready to Experience Luxury?
          </h2>
          <p className="text-muted-foreground text-lg">
            Book your stay at Royal Plaza Hotels today.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base font-semibold">
            <Link to="/register">Book Your Stay</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
