import { FormEvent, useState } from "react";
import Seo from "@/components/layout/Seo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Phone, Mail, MapPin, Users, MessageCircle, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/Hero4.jpg";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    const { error } = await supabase.from("contact_messages").insert([payload]);
    setLoading(false);

    if (error) {
      toast({ title: "Could not send message", description: error.message });
      return;
    }

    toast({ title: "Message sent", description: "Thanks for reaching out — we'll reply shortly." });
    form.reset();
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      value: "hello@bloomweddings.com",
      description: "Send us a detailed message"
    },
    {
      icon: MapPin,
      title: "Office",
      value: "123 Wedding Lane, City, ST 12345",
      description: "Visit us for in-person consultation"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "By appointment only" }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Wedding Planner",
      description: "10+ years of experience creating magical celebrations",
      email: "sarah@bloomweddings.com"
    },
    {
      name: "Michael Chen",
      role: "Senior Event Coordinator",
      description: "Specializes in destination weddings and unique venues",
      email: "michael@bloomweddings.com"
    },
    {
      name: "Emma Rodriguez",
      role: "Floral & Design Specialist",
      description: "Expert in creating stunning floral arrangements and decor",
      email: "emma@bloomweddings.com"
    }
  ];

  const quickLinks = [
    {
      title: "Book Consultation",
      description: "Schedule a free initial consultation",
      link: "/booking",
      icon: Calendar
    },
    {
      title: "View Services",
      description: "Explore our wedding planning packages",
      link: "/services",
      icon: Users
    },
    {
      title: "Browse Gallery",
      description: "See our recent wedding celebrations",
      link: "/gallery",
      icon: MessageCircle
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
            backgroundPosition: "bottom center",
          }}
        />
        <div className="container-padded relative mx-auto flex min-h-[70vh] items-center py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
            Contact Us
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Share a few details and we'll be in touch shortly.
            </p>
            </div>
        </div>
      </section>

      <main className="container-padded py-12">
        <Seo
          title="Contact – Speak with a Planner | Bloom Weddings"
          description="Contact Bloom Weddings for elegant, floral wedding planning. We'd love to hear about your celebration."
          canonicalPath="/contact"
        />

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our services? Want to discuss your wedding vision? We'd love to hear from you.
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
              </div>
              <div>
                <Label htmlFor="message">How can we help?</Label>
                <Textarea id="message" name="message" required placeholder="Tell us about your event…" rows={5} />
              </div>
              <div className="flex items-center justify-end">
                <Button type="submit" variant="hero" className="hover-float" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to reach us. We're here to help with all your wedding planning needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover-float">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold mb-2">{info.value}</div>
                  <p className="text-muted-foreground text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-muted/30 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Office Hours</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're available during these hours for consultations and meetings.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-muted-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  Outside of business hours? Send us a message and we'll get back to you within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced wedding planners are here to make your dream wedding a reality.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover-float">
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{member.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                      {member.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Links</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our services and resources to learn more about what we offer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover-float">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <link.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{link.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <a href={link.link}>Learn More</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
