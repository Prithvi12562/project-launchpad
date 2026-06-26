import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  Wifi, Wind, Waves, UtensilsCrossed, Car, Building2, Star,
  Phone, Mail, MapPin, Clock, ChevronDown, Send, Menu, X,
  Minus, Plus, IndianRupee, QrCode, Copy, Check, LogOut, User,
  ArrowRight, Sparkles, Crown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  { icon: Wifi, label: "Free WiFi", desc: "High-speed internet throughout" },
  { icon: Wind, label: "AC Rooms", desc: "Climate-controlled comfort" },
  { icon: Waves, label: "Swimming Pool", desc: "Refreshing outdoor pool" },
  { icon: UtensilsCrossed, label: "Restaurant", desc: "Fine dining experience" },
  { icon: Car, label: "Free Parking", desc: "Secure valet parking" },
  { icon: Building2, label: "Banquet Hall", desc: "Events & celebrations" },
];

const GALLERY_IMAGES = [
  { src: receptionImg, alt: "Hotel Reception" },
  { src: hallwayImg, alt: "Hotel Hallway" },
  { src: restaurantImg, alt: "Restaurant" },
  { src: insideRoomImg, alt: "Room Interior" },
  { src: bathroomImg, alt: "Bathroom" },
  { src: room3Img, alt: "AC Room" },
  { src: room4Img, alt: "Super Deluxe Room" },
  { src: room2Img, alt: "Deluxe Room" },
];

const ROOM_TYPES = [
  { id: "deluxe", name: "Deluxe Room", price: 1500, image: room3Img, description: "AC room with attached bathroom, TV, and all modern facilities for a comfortable stay.", bestSeller: false },
  { id: "super-deluxe", name: "Super Deluxe Room", price: 4500, image: room4Img, description: "Premium AC room with swimming pool access, attached bathroom, TV, and luxury amenities.", bestSeller: true },
];

const UPI_ID = "royalplazahotels@upi";

/* ─── Intersection Observer hook for scroll animations ─── */
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const SectionHeading = ({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) => (
  <div className="text-center space-y-4 mb-16">
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-[0.2em]">
      <Sparkles className="h-3.5 w-3.5" />
      {tag}
    </span>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
      {title}
    </h2>
    {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const Landing = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "", phone: "", email: "", checkIn: "", checkOut: "", guests: "1", requests: "",
  });
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({
    deluxe: 0, "super-deluxe": 0,
  });

  const aboutView = useInView();
  const roomsView = useInView();
  const amenitiesView = useInView();
  const galleryView = useInView();
  const contactView = useInView();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const updateRoomCount = (id: string, delta: number) => {
    setRoomCounts((prev) => ({ ...prev, [id]: Math.max(0, Math.min(10, (prev[id] || 0) + delta)) }));
  };

  const nights = useMemo(() => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const diff = new Date(bookingForm.checkOut).getTime() - new Date(bookingForm.checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [bookingForm.checkIn, bookingForm.checkOut]);

  const totalRooms = Object.values(roomCounts).reduce((a, b) => a + b, 0);

  const totalPrice = useMemo(() => {
    return ROOM_TYPES.reduce((sum, room) => sum + (roomCounts[room.id] || 0) * room.price * Math.max(1, nights), 0);
  }, [roomCounts, nights]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  const copyUpi = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleBooking = async () => {
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.checkIn || !bookingForm.checkOut) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (totalRooms === 0) {
      toast({ title: "Please select at least one room", variant: "destructive" });
      return;
    }
    if (nights <= 0) {
      toast({ title: "Check-out must be after check-in", variant: "destructive" });
      return;
    }
    setBookingSubmitting(true);
    try {
      const roomSummary = ROOM_TYPES
        .filter((r) => (roomCounts[r.id] || 0) > 0)
        .map((r) => `${roomCounts[r.id]} × ${r.name}`)
        .join(", ");
      const { error } = await supabase.functions.invoke("send-booking-email", {
        body: {
          guest_name: bookingForm.name,
          guest_email: bookingForm.email || "",
          guest_phone: bookingForm.phone,
          room_type: roomSummary,
          check_in: bookingForm.checkIn,
          check_out: bookingForm.checkOut,
          num_guests: Math.max(1, parseInt(bookingForm.guests || "1", 10)),
          special_requests: bookingForm.requests || "",
          total_price: totalPrice,
        },
      });
      if (error) throw error;
      setBookingSuccess(true);
      toast({ title: "Booking request sent!", description: "Complete payment via UPI below." });
    } catch (e) {
      console.error(e);
      toast({ title: "Could not send booking", description: "Please try again or contact us.", variant: "destructive" });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setBookingForm({ name: "", phone: "", email: "", checkIn: "", checkOut: "", guests: "1", requests: "" });
    setRoomCounts({ deluxe: 0, "super-deluxe": 0 });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        navScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-18 py-4">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-heading font-bold leading-tight transition-colors ${navScrolled ? "text-foreground" : "text-white"}`}>
                Royal Plaza
              </span>
              <span className={`text-[10px] uppercase tracking-[0.15em] font-medium transition-colors ${navScrolled ? "text-accent" : "text-gold-light"}`}>
                Hotels
              </span>
            </div>
          </button>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href.slice(1))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                    navScrolled ? "text-muted-foreground hover:text-primary hover:bg-primary/5" : "text-white/80 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                  <Avatar className="h-7 w-7 ring-2 ring-accent/30">
                    <AvatarFallback className="bg-accent/20 text-accent text-xs font-bold">
                      {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium ${navScrolled ? "text-foreground" : "text-white"}`}>
                    Hi, {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </span>
                </div>
                <Link to="/dashboard">
                  <Button size="sm" variant="ghost" className={`${navScrolled ? "text-muted-foreground hover:text-primary" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                    <User className="h-4 w-4 mr-1" /> Dashboard
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" className={`${navScrolled ? "text-muted-foreground hover:text-primary" : "text-white/70 hover:text-white hover:bg-white/10"}`} onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login">
                  <Button size="sm" variant="ghost" className={`${navScrolled ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25 font-semibold hidden sm:inline-flex"
              onClick={() => scrollTo("booking")}
            >
              Book Now <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${navScrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"}`}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 py-5 space-y-1 animate-fade-in">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-secondary/50">
                <Avatar className="h-9 w-9 ring-2 ring-accent/30">
                  <AvatarFallback className="bg-accent/20 text-accent text-sm font-bold">
                    {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Hi, {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href.slice(1))}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                {l.label}
              </button>
            ))}
            <div className="pt-3 mt-3 border-t border-border/50 space-y-1">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                    <User className="h-4 w-4" /> Dashboard
                  </Link>
                  <button onClick={signOut} className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileNavOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-accent hover:bg-accent/5 transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>
            <Button className="w-full mt-3 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" onClick={() => scrollTo("booking")}>
              Book Now <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Static background image */}
        <div className="absolute inset-0 bg-background">
          <img
            src={exteriorImg}
            alt="Royal Plaza Hotel Dhanaura exterior - best hotel in Barara Ambala Haryana"
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Subtle bottom fade for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />

        {/* Ambient glow blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-36 md:pb-24 min-h-screen flex flex-col items-center justify-center text-center">
          <div className="space-y-7 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-white/10 backdrop-blur-md">
              <Star className="h-3.5 w-3.5 text-accent fill-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                Premium Luxury Stay
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.02] tracking-tight drop-shadow-lg">
              Royal Plaza
              <span className="block text-gradient-gold mt-2">Hotels</span>
            </h1>

            <p className="text-base md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              The best hotel in Dhanaura — luxury AC rooms, exquisite dining, and warm hospitality in Dhanaura, Barara, Ambala, Haryana.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-9 text-base font-semibold shadow-xl shadow-accent/30 group"
                onClick={() => scrollTo("booking")}
              >
                Book Your Stay
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white bg-white/5 backdrop-blur-sm px-9 text-base font-medium"
                onClick={() => scrollTo("rooms")}
              >
                Explore Rooms
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <p className="text-2xl font-heading font-bold text-gold-light">500+</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">Guests</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-heading font-bold text-gold-light">4.8★</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">Rated</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-heading font-bold text-gold-light">24/7</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">Service</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => scrollTo("about")}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" className="relative px-4 py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent" />
        <div
          ref={aboutView.ref}
          className={`relative max-w-6xl mx-auto transition-all duration-700 ${aboutView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <SectionHeading tag="About Us" title="Experience Premium Hospitality" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <img src={receptionImg} alt="Reception at Royal Plaza Hotel Dhanaura" className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                <img src={restaurantImg} alt="Restaurant at Royal Plaza Hotel Barara Ambala" className="w-full h-48 object-cover rounded-2xl shadow-lg mt-8" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-8 py-4 flex items-center gap-6 shadow-xl">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Happy Guests</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-accent">4.8</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Royal Plaza Hotel Dhanaura is one of the best hotels in Dhanaura, offering comfortable AC rooms and a luxury experience for families, couples, travelers, and event guests. Located on Sadhaura Road, Barara, Ambala, Haryana, our hotel provides top-class hospitality with modern amenities, free parking, and warm service — making it the ideal choice for hotel booking in Dhanaura.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Near Dhanaura Bus Stand</p>
                    <p className="text-xs text-muted-foreground">Just 200m away — easy access</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Prachin Hanuman Mandir</p>
                    <p className="text-xs text-muted-foreground">Historic temple, 500m away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ROOMS ═══════════════════ */}
      <section id="rooms" className="px-4 py-24 md:py-32">
        <div
          ref={roomsView.ref}
          className={`max-w-6xl mx-auto transition-all duration-700 ${roomsView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <SectionHeading tag="Our Rooms" title="Choose Your Perfect Stay" subtitle="Thoughtfully designed rooms for an unforgettable experience" />

          <div className="grid md:grid-cols-2 gap-8">
            {ROOM_TYPES.map((room, idx) => (
              <div
                key={room.id}
                className={`group relative rounded-3xl overflow-hidden bg-card border hover-lift ${
                  room.bestSeller ? "border-accent/30 shadow-lg shadow-accent/10" : "border-border"
                }`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                {room.bestSeller && (
                  <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-bold shadow-lg shadow-accent/25">
                    <Star className="h-3.5 w-3.5 fill-current" /> Best Seller
                  </div>
                )}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={room.image}
                    alt={`${room.name} at Royal Plaza Hotel Dhanaura Barara`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-7 space-y-4">
                  <h3 className="text-2xl font-heading font-bold text-card-foreground">{room.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{room.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                      <span className="text-3xl font-bold text-gradient-gold">₹{room.price.toLocaleString("en-IN")}</span>
                      <span className="text-sm text-muted-foreground ml-1">/night</span>
                    </div>
                    <Button
                      className={`${room.bestSeller ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25" : "bg-primary hover:bg-primary/90 text-primary-foreground"} font-semibold group/btn`}
                      onClick={() => { updateRoomCount(room.id, 1); scrollTo("booking"); }}
                    >
                      Book Now <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ AMENITIES ═══════════════════ */}
      <section id="amenities" className="relative px-4 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent" />
        <div
          ref={amenitiesView.ref}
          className={`relative max-w-6xl mx-auto transition-all duration-700 ${amenitiesView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <SectionHeading tag="Amenities" title="Everything You Need" subtitle="World-class facilities for a luxurious experience" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {AMENITIES.map((a, i) => (
              <div
                key={a.label}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 hover:border-accent/40 hover-lift text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-accent/15 group-hover:to-accent/5 transition-colors duration-300">
                  <a.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{a.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ GALLERY ═══════════════════ */}
      <section id="gallery" className="px-4 py-24 md:py-32">
        <div
          ref={galleryView.ref}
          className={`max-w-6xl mx-auto transition-all duration-700 ${galleryView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <SectionHeading tag="Gallery" title="A Glimpse of Royal Plaza" subtitle="Step inside our world of luxury and comfort" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`group overflow-hidden rounded-2xl cursor-pointer relative ${
                  i === 0 || i === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover min-h-[180px] group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BOOKING ═══════════════════ */}
      <section id="booking" className="relative px-4 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <SectionHeading tag="Reservation" title="Book Your Stay" subtitle="Select rooms, fill in details, and pay via UPI" />

          {!bookingSuccess ? (
            <Card className="border-border/60 shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden">
              <CardContent className="p-6 md:p-10 space-y-7">
                {/* Room selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent" /> Select Rooms
                  </Label>
                  {ROOM_TYPES.map((room) => (
                    <div key={room.id} className={`flex items-center justify-between rounded-2xl border p-5 transition-all ${
                      roomCounts[room.id] > 0 ? "border-accent/40 bg-accent/5 shadow-sm" : "border-border hover:border-primary/20"
                    }`}>
                      <div className="space-y-1">
                        <p className="font-semibold text-card-foreground flex items-center gap-2">
                          {room.name}
                          {room.bestSeller && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">Popular</span>}
                        </p>
                        <p className="text-sm text-primary font-bold">₹{room.price.toLocaleString("en-IN")}<span className="text-muted-foreground font-normal">/night</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateRoomCount(room.id, -1)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-secondary hover:border-primary/30 transition-all disabled:opacity-30"
                          disabled={!roomCounts[room.id]}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-lg text-foreground">{roomCounts[room.id] || 0}</span>
                        <button
                          type="button"
                          onClick={() => updateRoomCount(room.id, 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Guest details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="b-name" className="text-sm font-medium">Full Name *</Label>
                    <Input id="b-name" placeholder="Your name" className="rounded-xl h-11" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-phone" className="text-sm font-medium">Phone *</Label>
                    <Input id="b-phone" placeholder="+91 XXXXX XXXXX" className="rounded-xl h-11" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-email" className="text-sm font-medium">Email</Label>
                  <Input id="b-email" type="email" placeholder="your@email.com" className="rounded-xl h-11" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
                </div>

                {/* Dates */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="b-checkin" className="text-sm font-medium">Check-in Date *</Label>
                    <Input id="b-checkin" type="date" className="rounded-xl h-11" value={bookingForm.checkIn} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-checkout" className="text-sm font-medium">Check-out Date *</Label>
                    <Input id="b-checkout" type="date" className="rounded-xl h-11" value={bookingForm.checkOut} min={bookingForm.checkIn || new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })} />
                  </div>
                </div>

                {/* Guests + Requests */}
                <div className="space-y-2">
                  <Label htmlFor="b-guests" className="text-sm font-medium">Number of Guests *</Label>
                  <Input id="b-guests" type="number" min={1} max={20} className="rounded-xl h-11" value={bookingForm.guests} onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-requests" className="text-sm font-medium">Special Requests</Label>
                  <Textarea id="b-requests" placeholder="Any preferences or notes…" className="rounded-xl min-h-[88px]" value={bookingForm.requests} onChange={(e) => setBookingForm({ ...bookingForm, requests: e.target.value })} />
                </div>

                {/* Price summary */}
                {totalRooms > 0 && (
                  <div className="rounded-2xl bg-gradient-to-br from-secondary/70 to-secondary/30 p-5 space-y-3 border border-border/30">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-accent" /> Booking Summary
                    </p>
                    {ROOM_TYPES.map((room) =>
                      roomCounts[room.id] > 0 ? (
                        <div key={room.id} className="flex justify-between text-sm text-muted-foreground">
                          <span>{roomCounts[room.id]} × {room.name} {nights > 0 ? `× ${nights} night${nights > 1 ? "s" : ""}` : ""}</span>
                          <span className="font-medium text-foreground">₹{(roomCounts[room.id] * room.price * Math.max(1, nights)).toLocaleString("en-IN")}</span>
                        </div>
                      ) : null
                    )}
                    <div className="border-t border-border/50 pt-3 flex justify-between font-bold text-foreground text-lg">
                      <span>Total</span>
                      <span className="text-gradient-gold">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base rounded-2xl h-13 shadow-xl shadow-accent/20 group"
                  size="lg"
                  onClick={handleBooking}
                  disabled={bookingSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {bookingSubmitting ? "Sending…" : "Confirm & Pay via UPI"}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* ─── UPI Payment Card ─── */
            <Card className="border-accent/30 shadow-2xl shadow-accent/10 rounded-3xl overflow-hidden">
              <CardContent className="p-6 md:p-10 space-y-6 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/10 text-green-600">
                  <Check className="h-5 w-5" />
                  <h3 className="text-lg font-heading font-bold">Booking Confirmed!</h3>
                </div>
                <p className="text-muted-foreground">
                  Please complete your payment of{" "}
                  <span className="font-bold text-gradient-gold text-lg">₹{totalPrice.toLocaleString("en-IN")}</span>{" "}
                  via UPI to confirm your reservation.
                </p>

                <div className="mx-auto flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-white p-8 max-w-xs shadow-inner">
                  <QrCode className="h-28 w-28 text-foreground/70" />
                  <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
                  <div className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5">
                    <span className="text-sm font-mono font-semibold text-foreground">{UPI_ID}</span>
                    <button onClick={copyUpi} className="text-primary hover:text-primary/80 transition-colors" aria-label="Copy UPI ID">
                      {upiCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/50 p-5 space-y-2 text-left">
                  <p className="text-sm font-bold text-foreground">Payment Summary</p>
                  {ROOM_TYPES.map((room) =>
                    roomCounts[room.id] > 0 ? (
                      <div key={room.id} className="flex justify-between text-sm text-muted-foreground">
                        <span>{roomCounts[room.id]} × {room.name} × {nights} night{nights > 1 ? "s" : ""}</span>
                        <span>₹{(roomCounts[room.id] * room.price * nights).toLocaleString("en-IN")}</span>
                      </div>
                    ) : null
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  After payment, send the screenshot to{" "}
                  <a href="https://wa.me/918288808857" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    WhatsApp (+91 8288808857)
                  </a>{" "}
                  for instant confirmation.
                </p>

                <Button variant="outline" onClick={resetBooking} className="rounded-xl">
                  Make Another Booking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="px-4 py-24 md:py-32">
        <div
          ref={contactView.ref}
          className={`max-w-6xl mx-auto transition-all duration-700 ${contactView.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <SectionHeading tag="Contact" title="Get In Touch" subtitle="We'd love to hear from you" />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: "Phone", content: "+91 8288808857", href: "tel:+918288808857" },
              { icon: Mail, title: "Email", content: "ranaabhishek1988@gmail.com", href: "mailto:ranaabhishek1988@gmail.com" },
              { icon: Clock, title: "Check-in / Out", content: "12:00 PM / 12:00 PM", href: null },
            ].map((item) => (
              <div key={item.title} className="group flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/80 p-8 text-center hover-lift">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-accent/15 group-hover:to-accent/5 transition-colors duration-300">
                  <item.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-semibold text-card-foreground">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/50 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm">VPO Dhanaura, Sadhaura Road, Barara, Ambala, Haryana, India</span>
            </div>
          </div>

          {/* Google Maps - click anywhere to open in Google Maps */}
          <a
            href="https://maps.app.goo.gl/2shczBTSCn1XvWKy5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Royal Plaza Hotels location in Google Maps"
            className="mt-12 group relative block rounded-3xl overflow-hidden border border-border/60 shadow-xl hover-lift cursor-pointer"
          >
            <iframe
              title="Royal Plaza Hotels location — Dhanaura, Barara, Ambala"
              src="https://maps.google.com/maps?q=Royal+Plaza+Hotels,+Sadhaura+Road,+Dhanaura,+Barara,+Ambala,+Haryana&t=m&z=16&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full block pointer-events-none"
            />
            {/* Hotel location pin overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center -translate-y-4">
                <div className="px-3 py-1.5 rounded-full bg-card/95 backdrop-blur-sm border border-accent/40 shadow-lg text-xs font-semibold text-foreground whitespace-nowrap">
                  Royal Plaza Hotels
                </div>
                <div className="relative mt-1">
                  <MapPin className="h-10 w-10 text-accent drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] fill-accent/30" strokeWidth={2.5} />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent/40 animate-ping" />
                </div>
              </div>
            </div>

            {/* Click hint */}
            <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/95 backdrop-blur-sm border border-border text-foreground text-sm font-semibold shadow-lg group-hover:scale-105 transition-transform">
              <MapPin className="h-4 w-4 text-accent" />
              Click to open in Google Maps
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>
        </div>
      </section>

      <div style={{ display: "none" }} aria-hidden="true">
        <p>Royal Plaza Hotel Dhanaura is one of the best hotels in Dhanaura, Barara, Ambala, Haryana. We offer luxury rooms, AC rooms, parking, swimming pool, restaurant, and comfortable stays for families, couples, and travelers looking for the best hotel in Dhanaura. Whether you need hotel booking in Dhanaura, hotels near Barara, or a premium hotel in Barara Ambala, Royal Plaza Hotels is your ideal destination. Conveniently located on Sadhaura Road near Dhanaura Bus Stand and Prachin Hanuman Mandir, we provide top-rated hospitality at affordable prices.</p>
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="relative border-t border-border bg-gradient-to-b from-card to-secondary/30 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-10">
            {/* Brand */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                  <Crown className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-card-foreground">Royal Plaza Hotels</h3>
              <p className="text-sm text-muted-foreground font-light">Where Luxury Meets Comfort</p>
            </div>

            {/* Nav links */}
            <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href.slice(1))}
                    className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <p className="text-xs text-muted-foreground/60">© 2026 Royal Plaza Hotels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
