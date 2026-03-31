import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hotel, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Hotel className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">
            HotelSite <span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/register">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
          </Button>
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/register" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
