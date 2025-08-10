import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import Seo from "@/components/layout/Seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Calendar, Image, LogOut, Settings } from "lucide-react";

interface BookingRow {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  event_date: string | null;
  event_type?: string | null;
  guests?: number | null;
  message?: string | null;
  created_at: string;
}

type AdminView = "bookings" | "gallery";


const Admin = () => {
  const { isAuthenticated, loading: authLoading, user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [currentView, setCurrentView] = useState<AdminView>("bookings");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      const load = async () => {
        let query = supabase
          .from("bookings")
          .select("id,name,email,phone,event_date,event_type,guests,message,created_at")
          .order("created_at", { ascending: false });
        const { data, error } = await query;
        if (error) {
          toast({ title: "Could not load bookings", description: error.message });
        } else {
          setBookings(data as BookingRow[]);
        }
      };
      load();
      const loadGalleryImages = async () => {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          toast({ title: "Could not load gallery images", description: error.message });
        } else {
          setGalleryImages(data || []);
        }
      };
      loadGalleryImages();
    }
  }, [isAuthenticated, isAdmin, authLoading, user]);

  if (authLoading) {
    return (
      <main className="container-padded py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }
  if (!isAuthenticated || !isAdmin) {
    return <NotFound />;
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    if (selectedImages.length === 0) {
      toast({ title: "No images selected", description: "Please select at least one image to upload." });
      return;
    }

    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !currentUser) {
      toast({ title: "Authentication error", description: "Please log in again to upload images." });
      return;
    }

    console.log("Current user:", currentUser);
    console.log("User ID:", currentUser.id);

    setUploading(true);
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        console.log("Uploading file:", fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, image);

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
            throw new Error('Storage bucket "gallery" not found. Please create it in your Supabase dashboard under Storage.');
          }
          throw uploadError;
        }

        console.log("File uploaded successfully:", uploadData);

        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        console.log("Public URL:", urlData.publicUrl);

        const { data: insertData, error: dbError } = await supabase
          .from('gallery_images')
          .insert({
            image_url: urlData.publicUrl,
            image_name: image.name,
            alt_text: image.name.replace(/\.[^/.]+$/, "")
          })
          .select();

        if (dbError) {
          console.error("Database insert error:", dbError);
          throw dbError;
        }

        console.log("Database insert successful:", insertData);

        return { success: true, fileName };
      });

      await Promise.all(uploadPromises);

      toast({ title: "Upload successful", description: `${selectedImages.length} images uploaded to gallery.` });
      setSelectedImages([]);

      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) {
        setGalleryImages(data || []);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `gallery/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        throw dbError;
      }

      toast({ title: "Image deleted", description: "Image removed from gallery." });

      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) {
        setGalleryImages(data || []);
      }
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("bw_admin_auth");
    window.dispatchEvent(new Event("bw-auth-changed"));
    navigate("/");
  };

  if (authLoading) {
    return (
      <main className="container-padded py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }
  if (!isAuthenticated || !isAdmin) {
    return <NotFound />;
  }

  return (
    <SidebarProvider>
      <Seo
        title="Admin – Dashboard | Bloom Weddings"
        description="Secure admin panel to view and manage wedding bookings and gallery images."
        canonicalPath="/admin"
      />

      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Admin Panel</span>
              <span className="truncate text-xs">Bloom Weddings</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="space-y-3">
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenuButton
              isActive={currentView === "bookings"}
              onClick={() => setCurrentView("bookings")}
              tooltip="Bookings"
            >
              <Calendar className="h-4 w-4" />
              <span>Bookings</span>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={currentView === "gallery"}
              onClick={() => setCurrentView("gallery")}
              tooltip="Gallery Images"
            >
              <Image className="h-4 w-4" />
              <span>Gallery Images</span>
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarContent>
        <SidebarHeader className="border-t border-sidebar-border">
          <SidebarMenuButton onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarHeader>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">
              {currentView === "bookings"
                ? isAdmin ? "Bookings" : "My Bookings"
                : "Gallery Images"}
            </h1>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Admin</span>
            {user?.email && <span className="text-xs text-muted-foreground">({user.email})</span>}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {currentView === "bookings" ? (
            <section className="p-6 rounded-lg border bg-card card-elevated">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">{isAdmin ? "All Bookings" : "My Bookings"}</h2>
                <p className="text-muted-foreground">{isAdmin ? "Manage and view all wedding booking inquiries." : "View your submitted booking requests."}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Guests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No bookings yet.</TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.name}</TableCell>
                        <TableCell className="truncate max-w-[220px]">{b.email}</TableCell>
                        <TableCell>{b.event_date ? new Date(b.event_date).toLocaleDateString() : "—"}</TableCell>
                        <TableCell className="capitalize">{b.event_type || "—"}</TableCell>
                        <TableCell>{b.guests ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </section>
          ) : (
            isAdmin ? (
              <section className="p-6 rounded-lg border bg-card card-elevated">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Gallery Images</h2>
                  <p className="text-muted-foreground">Upload and manage gallery images for the website.</p>
                </div>

                <div className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-upload">Select Images</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Select multiple images to upload to the gallery
                      </p>
                    </div>

                    {selectedImages.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Selected Images ({selectedImages.length})</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedImages([])}
                          >
                            Clear All
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Selected image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleImageRemove(index)}
                              >
                                ×
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {image.name}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="hero"
                            className="hover-float"
                            onClick={handleUploadImages}
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Upload to Gallery"}
                          </Button>
                          <Button variant="outline">
                            Preview Gallery
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Gallery Images ({galleryImages.length})</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                              <img
                                src={image.image_url}
                                alt={image.alt_text || image.image_name || "Gallery image"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteImage(image.id, image.image_url)}
                            >
                              ×
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {image.image_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ) : null
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Admin;

