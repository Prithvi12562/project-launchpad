import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wifi, Wind, Waves, UtensilsCrossed, Car, Building2, Star,
  Phone, Mail, MapPin, Clock, ChevronDown,
} from "lucide-react";
import exteriorImg from "@/assets/hotel/exterior.jpg";
import roomImg from "@/assets/hotel/room.jpg";
import room2Img from "@/assets/hotel/room2.jpg";
import room3Img from "@/assets/hotel/room3.jpg";
import room4Img from "@/assets/hotel/room4.jpg";
import insideRoomImg from "@/assets/hotel/inside_room.jpg";
import bathroomImg from "@/assets/hotel/bathroom.jpg";
import hallwayImg from "@/assets/hotel/hallway.jpg";
import receptionImg from "@/assets/hotel/reception.jpg";
import restaurantImg from "@/assets/hotel/restaurant.jpg";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const AMENITIES = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Wind, label: "AC Rooms" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: Car, label: "Parking" },
  { icon: Building2, label: "Banquet Hall" },
];

const GALLERY_IMAGES = [
  { src: receptionImg, alt: "Hotel Reception" },
  { src: hallwayImg, alt: "Hotel Hallway" },
  { src: restaurantImg, alt: "Restaurant" },
  { src: insideRoomImg, alt: "Room Interior" },
  { src: bathroomImg, alt: "Bathroom" },
  { src: room3Img, alt: "Room View" },
  { src: room4Img, alt: "Room View" },
  { src: room2Img, alt: "Room View" },
];

const Landing = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Sticky Navbar ─── */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <span className="font-heading text-xl font-bold text-primary">
            Royal Plaza
          </span>
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href.slice(1))}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link to="/register">Book Now</Link>
          </Button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section
        id="home"
        className="relative flex items-center justify-center min-h-[85vh] overflow-hidden"
      >
        <img
          src={exteriorImg}
          alt="Royal Plaza Hotels Exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4 space-y-5 max-w-3xl mx-auto animate-fade-in">
          <p className="uppercase tracking-[0.3em] text-sm font-medium text-[hsl(var(--gold-light))]">
            Luxury Stay in Barara
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
            Welcome to <br />
            <span className="text-[hsl(var(--accent))]">Royal Plaza</span> Hotels
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Where Luxury Meets Comfort — premium rooms, exquisite dining, and warm hospitality on Sadhaura Road, Barara.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base font-semibold">
              <Link to="/register">Book Your Stay</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10 px-10 text-base"
              onClick={() => scrollTo("rooms")}
            >
              View Rooms
            </Button>
          </div>
          <button
            onClick={() => scrollTo("about")}
            className="mt-8 inline-flex animate-bounce text-white/60 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="px-4 py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="uppercase tracking-[0.2em] text-sm font-medium text-accent">About Us</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Experience Premium Hospitality
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Royal Plaza Hotels is a premium hotel offering comfortable rooms and a luxury experience for families, couples, travelers, and event guests. Located on Sadhaura Road, Barara, we provide top-class hospitality with modern amenities and warm service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Near Dhanaura Bus Stand (200m)
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Prachin Hanuman Mandir (500m)
            </span>
          </div>
        </div>
      </section>

      {/* ─── Rooms ─── */}
      <section id="rooms" className="px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="uppercase tracking-[0.2em] text-sm font-medium text-accent">Our Rooms</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Choose Your Perfect Stay
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Deluxe Room */}
            <Card className="overflow-hidden border-border hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <img src={roomImg} alt="Deluxe Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-heading font-bold text-card-foreground">Deluxe Room</h3>
                <p className="text-muted-foreground text-sm">
                  AC room with attached bathroom, TV, and all modern facilities for a comfortable stay.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">₹1,500<span className="text-sm font-normal text-muted-foreground">/night</span></span>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link to="/register">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Super Deluxe Room */}
            <Card className="overflow-hidden border-accent/40 hover:shadow-xl transition-shadow duration-300 group relative">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold">
                <Star className="h-3 w-3" /> Best Seller
              </div>
              <div className="relative h-64 overflow-hidden">
                <img src={room2Img} alt="Super Deluxe Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-heading font-bold text-card-foreground">Super Deluxe Room</h3>
                <p className="text-muted-foreground text-sm">
                  Premium AC room with swimming pool access, attached bathroom, TV, and luxury amenities.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">₹4,500<span className="text-sm font-normal text-muted-foreground">/night</span></span>
                  <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    <Link to="/register">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Amenities ─── */}
      <section id="amenities" className="px-4 py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="uppercase tracking-[0.2em] text-sm font-medium text-accent">Amenities</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Everything You Need
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {AMENITIES.map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 hover:border-accent/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <a.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-card-foreground">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section id="gallery" className="px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="uppercase tracking-[0.2em] text-sm font-medium text-accent">Gallery</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              A Glimpse of Royal Plaza
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-lg group ${
                  i === 0 || i === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover min-h-[180px] group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="contact" className="px-4 py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="uppercase tracking-[0.2em] text-sm font-medium text-accent">Contact</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Get In Touch
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Phone</h3>
              <a href="tel:+918288808857" className="text-muted-foreground hover:text-primary transition-colors">
                +91 8288808857
              </a>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Email</h3>
              <a href="mailto:ranaabhishek1988@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                ranaabhishek1988@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">Check-in / Out</h3>
              <p className="text-muted-foreground text-sm">12:00 PM / 12:00 PM</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Sadhaura Road, VPO Dhanaura, Barara, Ambala, Haryana, India
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-card px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold text-card-foreground">Royal Plaza Hotels</h3>
            <p className="text-sm text-muted-foreground">Where Luxury Meets Comfort</p>
          </div>
          <ul className="flex items-center gap-6 text-sm text-muted-foreground">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button onClick={() => scrollTo(l.href.slice(1))} className="hover:text-primary transition-colors">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">© 2026 Royal Plaza Hotels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
