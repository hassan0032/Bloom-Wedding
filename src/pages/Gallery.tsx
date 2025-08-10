import { useEffect, useState } from "react";
import Seo from "@/components/layout/Seo";
import heroImage from "@/assets/Hero3.jpg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  image_url: string;
  image_name: string | null;
  alt_text: string | null;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const imagesPerPage = 6;

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, imagesPerPage - 1);
        
        if (error) {
          console.error("Error loading gallery images:", error);
        } else {
          setImages(data || []);
          setHasMore((data || []).length === imagesPerPage);
        }
      } catch (error) {
        console.error("Error loading gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryImages();
  }, []);

  const loadMoreImages = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const from = nextPage * imagesPerPage;
      const to = from + imagesPerPage - 1;
      
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error("Error loading more gallery images:", error);
      } else {
        setImages(prev => [...prev, ...(data || [])]);
        setHasMore((data || []).length === imagesPerPage);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more gallery images:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
          }}
        />
        <div className="container-padded relative mx-auto flex min-h-[70vh] items-center py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
              Wedding Gallery
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A glimpse into our floral, elegant celebrations.
            </p>
          </div>
        </div>
      </section>
      <main className="container-padded py-12">
        <Seo
          title="Gallery – Floral Wedding Inspiration | Bloom Weddings"
          description="Browse our elegant wedding gallery featuring floral styling, tablescapes, arches, cakes, and intimate bridal details."
          canonicalPath="/gallery"
        />
        <section className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading gallery...</p>
                </div>
              </div>
            ) : images.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No gallery images available yet.</p>
              </div>
            ) : (
              images.map((img) => (
                <figure key={img.id} className="overflow-hidden rounded-lg border bg-card hover-float">
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.image_name || "Gallery image"}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="p-3 text-sm text-muted-foreground">
                    {img.alt_text || img.image_name || "Gallery image"}
                  </figcaption>
                </figure>
              ))
            )}
          </div>
          
          {!loading && images.length > 0 && hasMore && (
            <div className="flex justify-center pt-8">
              <Button 
                onClick={loadMoreImages}
                disabled={loadingMore}
                variant="outline"
                size="lg"
                className="hover-float"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Show More Images"
                )}
              </Button>
            </div>
          )}
          
          {!loading && images.length > 0 && !hasMore && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You've reached the end of our gallery. Check back soon for more beautiful moments!
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Gallery;
