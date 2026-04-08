import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wifi, Wind, Waves, UtensilsCrossed, Car, Building2, Star,
  Phone, Mail, MapPin, Clock, ChevronDown, Send, Menu, X,
  Minus, Plus, IndianRupee, QrCode, Copy, Check,
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

const ROOM_TYPES = [
  { id: "deluxe", name: "Deluxe Room", price: 1500, image: roomImg, description: "AC room with attached bathroom, TV, and all modern facilities for a comfortable stay.", bestSeller: false },
  { id: "super-deluxe", name: "Super Deluxe Room", price: 4500, image: room2Img, description: "Premium AC room with swimming pool access, attached bathroom, TV, and luxury amenities.", bestSeller: true },
];

const UPI_ID = "royalplazahotels@upi";

const Landing = () => {
  const { toast } = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
  });
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({
    deluxe: 0,
    "super-deluxe": 0,
  });

  const updateRoomCount = (id: string, delta: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(10, (prev[id] || 0) + delta)),
    }));
  };

  const nights = useMemo(() => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const diff = new Date(bookingForm.checkOut).getTime() - new Date(bookingForm.checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [bookingForm.checkIn, bookingForm.checkOut]);

  const totalRooms = Object.values(roomCounts).reduce((a, b) => a + b, 0);

  const totalPrice = useMemo(() => {
    return ROOM_TYPES.reduce((sum, room) => {
      return sum + (roomCounts[room.id] || 0) * room.price * Math.max(1, nights);
    }, 0);
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
      await new Promise((r) => setTimeout(r, 1000));
      setBookingSuccess(true);
      toast({ title: "Booking request sent!", description: "Complete payment via UPI below." });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setBookingForm({ name: "", phone: "", email: "", checkIn: "", checkOut: "" });
    setRoomCounts({ deluxe: 0, "super-deluxe": 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Sticky Navbar ─── */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <span className="font-heading text-xl font-bold text-primary">
            Royal Plaza
          </span>
          <ul className="hidden lg:flex items-center gap-6">
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
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" onClick={() => scrollTo("booking")}>
              Book Now
            </Button>
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-1 animate-fade-in">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href.slice(1))}
                className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <section
        id="home"
        className="relative flex items-center justify-center min-h-[85vh] overflow-hidden"
      >
        <img
          src={exteriorImg}
          alt="Royal Plaza Hotels Exterior"
          className="absolute inset-0 w-full h-full object-cover object-top"
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
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base font-semibold" onClick={() => scrollTo("booking")}>
              Book Your Stay
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/60 text-white bg-white/10 hover:bg-white/20 px-10 text-base font-semibold"
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
            {ROOM_TYPES.map((room) => (
              <Card key={room.id} className={`overflow-hidden hover:shadow-xl transition-shadow duration-300 group relative ${room.bestSeller ? "border-accent/40" : "border-border"}`}>
                {room.bestSeller && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold">
                    <Star className="h-3 w-3" /> Best Seller
                  </div>
                )}
                <div className="relative h-64 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-heading font-bold text-card-foreground">{room.name}</h3>
                  <p className="text-muted-foreground text-sm">{room.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{room.price.toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-muted-foreground">/night</span>
                    </span>
                    <Button size="sm" className={room.bestSeller ? "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" : "bg-primary hover:bg-primary/90 text-primary-foreground"} onClick={() => { updateRoomCount(room.id, 1); scrollTo("booking"); }}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* ─── Booking ─── */}
      <section id="booking" className="px-4 py-20">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="uppercase tracking-[0.2em] text-sm font-medium text-accent">Reservation</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Book Your Stay
            </h2>
            <p className="text-muted-foreground">Select rooms, fill in details, and pay via UPI.</p>
          </div>

          {!bookingSuccess ? (
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Room selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Select Rooms</Label>
                  {ROOM_TYPES.map((room) => (
                    <div key={room.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-card-foreground">{room.name}</p>
                        <p className="text-sm text-primary font-semibold">₹{room.price.toLocaleString("en-IN")}/night</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateRoomCount(room.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-30"
                          disabled={!roomCounts[room.id]}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-foreground">{roomCounts[room.id] || 0}</span>
                        <button
                          type="button"
                          onClick={() => updateRoomCount(room.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary transition-colors"
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
                    <Label htmlFor="b-name">Full Name *</Label>
                    <Input id="b-name" placeholder="Your name" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-phone">Phone *</Label>
                    <Input id="b-phone" placeholder="+91 XXXXX XXXXX" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-email">Email</Label>
                  <Input id="b-email" type="email" placeholder="your@email.com" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
                </div>

                {/* Dates */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="b-checkin">Check-in Date *</Label>
                    <Input id="b-checkin" type="date" value={bookingForm.checkIn} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-checkout">Check-out Date *</Label>
                    <Input id="b-checkout" type="date" value={bookingForm.checkOut} min={bookingForm.checkIn || new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })} />
                  </div>
                </div>

                {/* Price summary */}
                {totalRooms > 0 && (
                  <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Booking Summary</p>
                    {ROOM_TYPES.map((room) =>
                      roomCounts[room.id] > 0 ? (
                        <div key={room.id} className="flex justify-between text-sm text-muted-foreground">
                          <span>{roomCounts[room.id]} × {room.name} {nights > 0 ? `× ${nights} night${nights > 1 ? "s" : ""}` : ""}</span>
                          <span>₹{(roomCounts[room.id] * room.price * Math.max(1, nights)).toLocaleString("en-IN")}</span>
                        </div>
                      ) : null
                    )}
                    <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
                      <span>Total</span>
                      <span className="flex items-center gap-1 text-primary">
                        <IndianRupee className="h-4 w-4" />
                        {totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                  size="lg"
                  onClick={handleBooking}
                  disabled={bookingSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {bookingSubmitting ? "Sending…" : "Confirm & Pay via UPI"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* ─── UPI Payment Card ─── */
            <Card className="border-accent/40">
              <CardContent className="p-6 md:p-8 space-y-6 text-center">
                <div className="flex items-center justify-center gap-2 text-accent">
                  <Check className="h-6 w-6" />
                  <h3 className="text-xl font-heading font-bold">Booking Confirmed!</h3>
                </div>
                <p className="text-muted-foreground">
                  Please complete your payment of{" "}
                  <span className="font-bold text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>{" "}
                  via UPI to confirm your reservation.
                </p>

                {/* UPI QR code placeholder */}
                <div className="mx-auto flex flex-col items-center gap-4 rounded-xl border border-border bg-white p-6 max-w-xs">
                  <QrCode className="h-32 w-32 text-foreground" />
                  <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                    <span className="text-sm font-mono font-medium text-foreground">{UPI_ID}</span>
                    <button onClick={copyUpi} className="text-primary hover:text-primary/80 transition-colors" aria-label="Copy UPI ID">
                      {upiCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4 space-y-2 text-left">
                  <p className="text-sm font-medium text-foreground">Payment Summary</p>
                  {ROOM_TYPES.map((room) =>
                    roomCounts[room.id] > 0 ? (
                      <div key={room.id} className="flex justify-between text-sm text-muted-foreground">
                        <span>{roomCounts[room.id]} × {room.name} × {nights} night{nights > 1 ? "s" : ""}</span>
                        <span>₹{(roomCounts[room.id] * room.price * nights).toLocaleString("en-IN")}</span>
                      </div>
                    ) : null
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  After payment, send the screenshot to{" "}
                  <a href="https://wa.me/918288808857" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    WhatsApp (+91 8288808857)
                  </a>{" "}
                  for instant confirmation.
                </p>

                <Button variant="outline" onClick={resetBooking} className="mt-2">
                  Make Another Booking
                </Button>
              </CardContent>
            </Card>
          )}
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
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="text-center">
            <h3 className="font-heading text-lg font-bold text-card-foreground">Royal Plaza Hotels</h3>
            <p className="text-sm text-muted-foreground">Where Luxury Meets Comfort</p>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
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
