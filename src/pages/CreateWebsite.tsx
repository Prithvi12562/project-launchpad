import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Hotel, Sparkles, BedDouble, Phone, MapPin, Plus, Trash2, ArrowLeft, Loader2, Star, Clock,
} from "lucide-react";

const AMENITY_OPTIONS = [
  "Free WiFi", "AC Rooms", "Swimming Pool", "Restaurant", "Parking", "Banquet Hall",
  "Gym", "Spa", "Room Service", "Laundry", "Bar", "Good Food",
];

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.string().max(20).optional(),
  best_seller: z.boolean().default(false),
});

const landmarkSchema = z.object({
  name: z.string().min(1, "Landmark name is required").max(100),
  distance: z.string().max(50).optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Hotel name is required").max(200),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email("Invalid email").max(255).optional().or(z.literal("")),
  check_in: z.string().max(20).optional(),
  check_out: z.string().max(20).optional(),
  amenities: z.array(z.string()),
  room_types: z.array(roomSchema).min(1, "Add at least one room type"),
  landmarks: z.array(landmarkSchema),
});

type FormValues = z.infer<typeof formSchema>;

const CreateWebsite = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Royal Plaza Hotels",
      tagline: "Where Luxury Meets Comfort",
      description:
        "Royal Plaza Hotels is a premium hotel offering comfortable rooms and a luxury experience for families, couples, travelers, and event guests. Located on Sadhaura Road, Barara, we provide top-class hospitality with modern amenities and warm service.",
      address: "Sadhaura Road, VPO Dhanaura, Barara, Ambala, Haryana, India",
      phone: "",
      email: "",
      check_in: "12:00 PM",
      check_out: "12:00 PM",
      amenities: ["Free WiFi", "Swimming Pool", "AC Rooms", "Restaurant", "Room Service", "Good Food"],
      room_types: [
        { name: "Deluxe Room", description: "AC room with attached bathroom, TV, and all modern facilities", price: "₹1,500", best_seller: false },
        { name: "Super Deluxe Room", description: "Premium AC room with swimming pool access, attached bathroom, TV, and luxury amenities", price: "₹4,500", best_seller: true },
      ],
      landmarks: [
        { name: "Dhanaura Bus Stand", distance: "200m" },
        { name: "Prachin Hanuman Mandir", distance: "500m" },
      ],
    },
  });

  const roomFields = useFieldArray({ control: form.control, name: "room_types" });
  const landmarkFields = useFieldArray({ control: form.control, name: "landmarks" });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.from("websites").insert({
        user_id: user.id,
        name: values.name,
        tagline: values.tagline || null,
        description: values.description || null,
        address: values.address || null,
        phone: values.phone || null,
        email: values.email || null,
        amenities: values.amenities as unknown as any,
        room_types: values.room_types.map((r) => ({
          ...r,
          check_in: values.check_in,
          check_out: values.check_out,
        })) as unknown as any,
        landmarks: values.landmarks as unknown as any,
        status: "draft",
      }).select().single();

      if (error) throw error;
      toast.success("Website created successfully!");
      navigate(`/editor?id=${data.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create website");
    } finally {
      setSubmitting(false);
    }
  };

  const tabOrder = ["details", "amenities", "rooms", "contact", "landmarks"];
  const nextTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1]);
  };
  const prevTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx > 0) setActiveTab(tabOrder[idx - 1]);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Create Your Website
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-5 mb-6">
                <TabsTrigger value="details" className="text-xs md:text-sm gap-1">
                  <Hotel className="h-3.5 w-3.5 hidden md:block" /> Details
                </TabsTrigger>
                <TabsTrigger value="amenities" className="text-xs md:text-sm gap-1">
                  <Sparkles className="h-3.5 w-3.5 hidden md:block" /> Amenities
                </TabsTrigger>
                <TabsTrigger value="rooms" className="text-xs md:text-sm gap-1">
                  <BedDouble className="h-3.5 w-3.5 hidden md:block" /> Rooms
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-xs md:text-sm gap-1">
                  <Phone className="h-3.5 w-3.5 hidden md:block" /> Contact
                </TabsTrigger>
                <TabsTrigger value="landmarks" className="text-xs md:text-sm gap-1">
                  <MapPin className="h-3.5 w-3.5 hidden md:block" /> Landmarks
                </TabsTrigger>
              </TabsList>

              {/* Hotel Details */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hotel Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name *</FormLabel>
                        <FormControl><Input placeholder="Royal Plaza Hotels" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tagline" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl><Input placeholder="Where Luxury Meets Comfort" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your hotel..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Amenities */}
              <TabsContent value="amenities">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="amenities" render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {AMENITY_OPTIONS.map((amenity) => (
                            <FormField key={amenity} control={form.control} name="amenities"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(amenity)}
                                      onCheckedChange={(checked) => {
                                        field.onChange(
                                          checked
                                            ? [...field.value, amenity]
                                            : field.value.filter((v: string) => v !== amenity)
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {amenity}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rooms */}
              <TabsContent value="rooms">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Room Types
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => roomFields.append({ name: "", description: "", price: "", best_seller: false })}>
                        <Plus className="h-4 w-4 mr-1" /> Add Room
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {roomFields.fields.map((field, index) => (
                      <div key={field.id} className="rounded-lg border border-border p-4 space-y-3 relative">
                        {roomFields.fields.length > 1 && (
                          <Button type="button" variant="ghost" size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-destructive"
                            onClick={() => roomFields.remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <FormField control={form.control} name={`room_types.${index}.name`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room Name *</FormLabel>
                            <FormControl><Input placeholder="Super Deluxe Room" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`room_types.${index}.description`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea placeholder="AC room with attached facilities..." rows={2} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`room_types.${index}.price`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Night</FormLabel>
                            <FormControl><Input placeholder="₹1,500" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`room_types.${index}.best_seller`} render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-yellow-500" /> Mark as Best Seller
                            </FormLabel>
                          </FormItem>
                        )} />
                      </div>
                    ))}
                    {form.formState.errors.room_types?.root && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.room_types.root.message}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact */}
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact & Timings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Sadhaura Road, VPO Dhanaura, Barara, Ambala, Haryana" rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input placeholder="info@royalplaza.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="check_in" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Check-in Time
                          </FormLabel>
                          <FormControl><Input placeholder="12:00 PM" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="check_out" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Check-out Time
                          </FormLabel>
                          <FormControl><Input placeholder="12:00 PM" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Landmarks */}
              <TabsContent value="landmarks">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Nearby Landmarks
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => landmarkFields.append({ name: "", distance: "" })}>
                        <Plus className="h-4 w-4 mr-1" /> Add Landmark
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {landmarkFields.fields.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No landmarks added yet. Click "Add Landmark" to get started.
                      </p>
                    )}
                    {landmarkFields.fields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField control={form.control} name={`landmarks.${index}.name`} render={({ field }) => (
                            <FormItem>
                              <FormControl><Input placeholder="Prachin Hanuman Mandir" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`landmarks.${index}.distance`} render={({ field }) => (
                            <FormItem>
                              <FormControl><Input placeholder="500m" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <Button type="button" variant="ghost" size="icon"
                          className="text-destructive mt-1" onClick={() => landmarkFields.remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevTab}
                disabled={activeTab === tabOrder[0]}>
                Previous
              </Button>
              {activeTab === tabOrder[tabOrder.length - 1] ? (
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                  Create Website
                </Button>
              ) : (
                <Button type="button" onClick={nextTab}>Next</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateWebsite;
