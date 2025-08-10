import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Seo from "@/components/layout/Seo";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/Hero1.jpg";

const Index = () => {
  const pageTitle = "Bloom Weddings – Elegant Wedding Event Planner";
  const pageDesc = "Floral, elegant wedding planning services. Book your dream day with bespoke packages, galleries, and easy online booking.";
  
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);
        
        if (error) {
          console.error("Error loading gallery images:", error);
        } else {
          setGalleryImages(data || []);
        }
      } catch (error) {
        console.error("Error loading gallery images:", error);
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  const testimonials = [
    {
      name: "Sarah & Michael",
      role: "Bride & Groom",
      content: "Bloom made our wedding day absolutely magical. Every detail was perfect, from the floral arrangements to the timeline execution.",
      rating: 5,
      date: "March 2024"
    },
    {
      name: "Emma & James",
      role: "Bride & Groom", 
      content: "The team's attention to detail and calm presence made our day stress-free. Our guests still talk about how beautiful everything was.",
      rating: 5,
      date: "February 2024"
    },
    {
      name: "Lisa & David",
      role: "Bride & Groom",
      content: "Professional, creative, and genuinely caring. They brought our vision to life beyond our expectations. Highly recommend!",
      rating: 5,
      date: "January 2024"
    },
    {
      name: "Rachel & Thomas",
      role: "Bride & Groom",
      content: "From the initial consultation to the last dance, Bloom exceeded our expectations. The floral arrangements were breathtaking!",
      rating: 5,
      date: "December 2023"
    },
    {
      name: "Amanda & Christopher",
      role: "Bride & Groom",
      content: "We couldn't have asked for a better wedding planning experience. The team handled everything flawlessly while we enjoyed our special day.",
      rating: 5,
      date: "November 2023"
    },
    {
      name: "Jessica & Ryan",
      role: "Bride & Groom",
      content: "Bloom transformed our wedding vision into reality. The attention to detail and personalized service was incredible. Thank you!",
      rating: 5,
      date: "October 2023"
    },
    {
      name: "Nicole & Brandon",
      role: "Bride & Groom",
      content: "The planning process was so smooth and enjoyable. Our wedding day was perfect in every way. Bloom is truly exceptional!",
      rating: 5,
      date: "September 2023"
    },
    {
      name: "Megan & Alex",
      role: "Bride & Groom",
      content: "Professional, creative, and absolutely wonderful to work with. Our destination wedding was everything we dreamed of and more.",
      rating: 5,
      date: "August 2023"
    }
  ];

  const stats = [
    { number: "150+", label: "Weddings Planned" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "5.0", label: "Average Rating" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <main>
      <Seo title={pageTitle} description={pageDesc} canonicalPath="/" />
      
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
              Wedding Event Planner – Floral, Elegant, Memorable
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We craft beautiful celebrations with refined details and a calm, floral aesthetic. From intimate ceremonies to grand receptions.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="hero" size="lg" className="hover-float">
                <Link to="/booking">Plan Your Dream Day</Link>
              </Button>
              <Button asChild variant="elevated" size="lg">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-padded py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card card-elevated hover-float">
            <h3 className="text-2xl font-semibold">Personalized Planning</h3>
            <p className="mt-2 text-muted-foreground">Tailored packages that reflect your story and style.</p>
          </div>
          <div className="p-6 rounded-lg border bg-card card-elevated hover-float">
            <h3 className="text-2xl font-semibold">Vendor Curation</h3>
            <p className="mt-2 text-muted-foreground">Trusted florists, venues, and creatives aligned to your vision.</p>
          </div>
          <div className="p-6 rounded-lg border bg-card card-elevated hover-float">
            <h3 className="text-2xl font-semibold">Day-of Excellence</h3>
            <p className="mt-2 text-muted-foreground">Relax and enjoy—our team orchestrates every detail seamlessly.</p>
          </div>
        </div>
      </section>

      <section className="container-padded py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Couples Choose Bloom</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our track record speaks for itself. We've helped hundreds of couples create their perfect day.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-padded py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recent Celebrations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a peek at some of our recent weddings and events. Each celebration is unique and beautiful in its own way.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {galleryLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading gallery...</p>
              </div>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No gallery images available yet.</p>
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <div className="p-1">
                      <Card>
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={image.image_url}
                            alt={image.alt_text || image.image_name || `Wedding gallery image ${index + 1}`}
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </AspectRatio>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
          <div className="text-center mt-6">
            <Button asChild variant="outline">
              <Link to="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-padded py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Couples Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our happy couples have to say about their experience.
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
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="text-xs text-muted-foreground mt-1">{testimonial.date}</div>
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

      <section className="container-padded py-16 bg-primary text-primary-foreground">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Let's create the wedding of your dreams together. Book a consultation and let's start planning your perfect day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/booking">Book Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
