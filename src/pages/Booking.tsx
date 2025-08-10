import { FormEvent, useState } from "react";
import Seo from "@/components/layout/Seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Clock, Users, Calendar, Star, Phone, Mail, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/Hero5.jpg";

const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({ 
        title: "Authentication Required", 
        description: "Please log in to submit a booking request.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      event_date: String(formData.get("event_date") || ""),
      event_type: eventType || null,
      guests: formData.get("guests") ? Number(formData.get("guests")) : null,
      message: String(formData.get("message") || ""),
    };
    const { error } = await supabase.from("bookings").insert([payload]);
    setLoading(false);
    if (error) {
      toast({ title: "Could not submit booking", description: error.message });
      return;
    }
    toast({ title: "Booking submitted", description: "We'll be in touch to confirm details." });
    form.reset();
    setEventType("");
  };

  const benefits = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "We'll get back to you within 24 hours with a personalized proposal."
    },
    {
      icon: Users,
      title: "Personal Consultation",
      description: "Free initial consultation to discuss your vision and requirements."
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "We work around your schedule for meetings and planning sessions."
    },
    {
      icon: Star,
      title: "Expert Guidance",
      description: "Access to our network of trusted vendors and venues."
    }
  ];

  const faqs = [
    {
      question: "How soon should I book my wedding date?",
      answer: "We recommend booking 12-18 months in advance for full planning services. Popular dates and venues fill up quickly, so early booking ensures you get your preferred choices."
    },
    {
      question: "What happens after I submit my booking request?",
      answer: "Within 24 hours, we'll contact you to schedule a consultation. We'll discuss your vision, budget, and timeline, then provide a customized proposal for your special day."
    },
    {
      question: "Can you help with destination weddings?",
      answer: "Absolutely! We love destination weddings and have experience planning celebrations in various locations. We can travel to your chosen destination or coordinate with local vendors."
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      content: "The booking process was so smooth! Within hours of submitting our request, we had a consultation scheduled. The team really listened to our vision.",
      rating: 5,
      date: "March 2024"
    },
    {
      name: "Emma & James",
      content: "We were nervous about planning our wedding, but the initial consultation put us at ease. The team's expertise and attention to detail is unmatched.",
      rating: 5,
      date: "February 2024"
    },
    {
      name: "Lisa & David",
      content: "From the first contact to the final details, Bloom made everything feel effortless. The booking process was transparent and professional.",
      rating: 5,
      date: "January 2024"
    },
    {
      name: "Rachel & Thomas",
      content: "The consultation call was incredibly helpful. They asked all the right questions and immediately understood our vision. Highly recommend!",
      rating: 5,
      date: "December 2023"
    },
    {
      name: "Amanda & Christopher",
      content: "We submitted our booking request and within 24 hours had a detailed proposal. The team's responsiveness and professionalism is outstanding.",
      rating: 5,
      date: "November 2023"
    },
    {
      name: "Jessica & Ryan",
      content: "The booking experience was seamless. They made us feel like our wedding was their top priority from day one. Exceptional service!",
      rating: 5,
      date: "October 2023"
    },
    {
      name: "Nicole & Brandon",
      content: "We were impressed by how quickly they responded to our booking request. The initial consultation exceeded our expectations.",
      rating: 5,
      date: "September 2023"
    },
    {
      name: "Megan & Alex",
      content: "The booking process was straightforward and stress-free. The team's attention to detail started from our very first interaction.",
      rating: 5,
      date: "August 2023"
    }
  ];

  return (
    <>
      <section
        className="relative overflow-hidden"
        aria-label="Hero section with floral background"
      >
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(180deg, hsl(var(--background) / 0.3), hsl(var(--background))), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container-padded relative mx-auto flex min-h-[70vh] items-center py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
              Event Booking Form
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Fill in your event details and our team will contact you shortly to finalize everything.
            </p>
          </div>
        </div>
      </section>

      <main className="container-padded py-12">
        <Seo
          title="Booking – Reserve Your Wedding Date | Bloom Weddings"
          description="Send your wedding booking request. Provide event details and we'll follow up to confirm and finalize."
          canonicalPath="/booking"
        />

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Book Your Special Day</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us about your dream wedding and we'll create a personalized plan just for you.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-5 p-6 rounded-lg border bg-card card-elevated">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" required placeholder="jane@email.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" required placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <Label htmlFor="date">Event Date</Label>
                  <Input id="date" type="date" name="event_date" required />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label>Event Type</Label>
                  <Select value={eventType} onValueChange={setEventType} name="event_type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="guests">Guests</Label>
                  <Input id="guests" type="number" name="guests" min={1} placeholder="120" />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Notes</Label>
                <Textarea id="message" name="message" placeholder="Tell us about your vision…" />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" variant="hero" className="hover-float" disabled={loading}>
                  {loading ? "Submitting…" : "Submit Booking"}
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="mb-16 bg-muted/30 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Bloom for Your Wedding</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make the booking and planning process simple, transparent, and enjoyable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover-float">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about booking and planning your wedding.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Couples Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from couples who have experienced our booking and planning process.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="h-full hover-float">
                        <CardContent className="p-6 h-full flex flex-col">
                          <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                          <p className="text-muted-foreground mb-4 italic flex-grow">"{testimonial.content}"</p>
                          <div className="mt-auto">
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.date}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        <section className="text-center bg-primary text-primary-foreground py-16 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Can't wait for a response? Reach out to us directly for urgent inquiries.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-8 h-8" />
              <div className="font-semibold">Call Us</div>
              <div className="text-sm opacity-90">+1 (555) 123-4567</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-8 h-8" />
              <div className="font-semibold">Email Us</div>
              <div className="text-sm opacity-90">hello@bloomweddings.com</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-8 h-8" />
              <div className="font-semibold">Visit Us</div>
              <div className="text-sm opacity-90">123 Wedding Lane, City</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Booking;
