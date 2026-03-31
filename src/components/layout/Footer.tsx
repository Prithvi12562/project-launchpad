import { Crown } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Crown className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-heading font-bold text-foreground">
              Royal Plaza <span className="text-accent">Hotels</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Royal Plaza Hotels. Luxury Stay in Barara.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
