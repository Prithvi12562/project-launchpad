import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Hotel, Zap } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            AI-Powered Hotel Websites
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground">
            Build Your Hotel's <span className="text-primary">Dream Website</span> in Minutes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning, premium hotel websites without any technical knowledge. Just enter your details and let AI do the magic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-base">
              <Link to="/register">Get Started Free</Link>
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
            Why Choose <span className="text-accent">HotelSite AI</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Generate a complete hotel website in under 5 minutes with our AI engine.",
              },
              {
                icon: Hotel,
                title: "Premium Design",
                desc: "Luxury themes with purple & gold aesthetics tailored for Indian hotels.",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                desc: "Smart image placement, content generation, and responsive layouts.",
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
            Ready to Build Your Website?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join hundreds of Indian hotel owners who trust HotelSite AI.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base font-semibold">
            <Link to="/register">Start Building Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
