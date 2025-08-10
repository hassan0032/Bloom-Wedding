import Seo from "@/components/layout/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Users, Calendar, Star } from "lucide-react";
import { Flower2, Camera, Music2, Utensils, MapPin, PartyPopper } from "lucide-react";
import heroImage from "@/assets/Hero2.jpg";

const services = [
  { icon: Flower2, title: "Full-Service Planning", desc: "Concept to celebration—complete planning and coordination." },
  { icon: MapPin, title: "Venue Scouting", desc: "Find the perfect setting that matches your taste and budget." },
  { icon: Camera, title: "Photo & Video", desc: "Curate premium storytellers to capture your day beautifully." },
  { icon: Utensils, title: "Catering & Cake", desc: "Delightful menus and exquisite cakes tailored to your guests." },
  { icon: Music2, title: "Entertainment", desc: "Elevated ambience—from live strings to upbeat DJs." },
  { icon: PartyPopper, title: "Styling & Decor", desc: "Floral-forward styling with refined, elegant details." },
];

const processSteps = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "We meet to discuss your vision, budget, and timeline. This is where we get to know you and your story.",
    icon: Users
  },
  {
    step: "02",
    title: "Planning & Design",
    description: "We create a comprehensive plan including venue selection, vendor curation, and timeline development.",
    icon: Calendar
  },
  {
    step: "03",
    title: "Vendor Coordination",
    description: "We work with our trusted network of vendors to bring your vision to life within your budget.",
    icon: Star
  },
  {
    step: "04",
    title: "Execution & Celebration",
    description: "On your special day, we handle all the details so you can relax and enjoy every moment.",
    icon: Clock
  }
];

const faqs = [
  {
    question: "How far in advance should we book your services?",
    answer: "We recommend booking 12-18 months in advance for full planning services, 6-12 months for partial planning, and at least 1 month for day-of coordination."
  },
  {
    question: "Do you work with specific venues or vendors?",
    answer: "We have a curated network of trusted vendors and venues, but we're happy to work with your preferred choices as well. We always prioritize what's best for your vision and budget."
  },
  {
    question: "What's included in the emergency kit?",
    answer: "Our emergency kit includes everything from safety pins and stain remover to backup flowers and a sewing kit. We're prepared for any situation that might arise on your special day."
  },
  {
    question: "Can you help with destination weddings?",
    answer: "Absolutely! We love destination weddings and have experience planning celebrations in various locations. We can travel to your chosen destination or coordinate with local vendors."
  },
];

const Services = () => {
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
            Wedding Planning Services
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Thoughtfully crafted offerings to bring your dream wedding to life with calm, floral elegance.
            </p>
          </div>
        </div>
      </section>

      <main className="container-padded py-12">
        <Seo
          title="Services – Wedding Event Planning | Bloom Weddings"
          description="Explore our wedding planning services: full-service planning, venue scouting, photography, catering, entertainment, and floral styling."
          canonicalPath="/services"
        />

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From full-service planning to day-of coordination, we offer comprehensive wedding planning services tailored to your needs.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="hover-float">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Icon className="text-primary" /> {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-muted/30 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a proven process to ensure your wedding planning journey is smooth and enjoyable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border transform -translate-y-1/2"></div>
                  )}
                </div>
                <div className="text-sm text-primary font-semibold mb-2">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions about our wedding planning services.
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

        <section className="text-center bg-primary text-primary-foreground py-16 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Let's discuss your vision and find the perfect planning package for your special day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/booking">Book Consultation</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Services;
