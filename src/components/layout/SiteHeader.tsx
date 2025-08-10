import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
    isActive ? "text-primary" : "text-foreground/80"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block w-full text-left px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors rounded-md ${
    isActive ? "text-primary bg-accent" : "text-foreground"
  }`;

const SiteHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  const handleLogout = async () => {
    await import("@/integrations/supabase/client").then(async ({ supabase }) => {
      await supabase.auth.signOut();
    });
    localStorage.removeItem("bw_admin_auth");
    window.dispatchEvent(new Event("bw-auth-changed"));
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-padded flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">Bloom Weddings</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/gallery" className={navLinkClass}>
            Gallery
          </NavLink>
          <NavLink to="/booking" className={navLinkClass}>
            Booking
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>
        
        {/* Desktop Buttons */}
        <div className="hidden lg:block space-x-4">
          {!loading && (
            <>
              {(!isAuthenticated || !isAdmin) && (
                // Show Book Date for unauthenticated and customer users
                <Button asChild variant="hero" size="lg" className="hover-float">
                  <Link to="/booking" aria-label="Book your wedding event">
                    Book Your Date
                  </Link>
                </Button>
              )}
              {!isAuthenticated ? (
                // User is logged out - show Login button
                <Button asChild variant="hero" size="lg" className="hover-float">
                  <Link to="/auth" aria-label="Login">
                    Login
                  </Link>
                </Button>
              ) : isAdmin ? (
                // User is admin - show Dashboard and Logout buttons
                <>
                  <Button asChild variant="hero" size="lg" className="hover-float">
                    <Link to="/admin" aria-label="Dashboard">
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="hover-float" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                // User is customer - show Logout button only
                <Button variant="outline" size="lg" className="hover-float" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        <div className="lg:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="px-4 pb-4">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-1 mb-6">
                  <DrawerClose asChild>
                    <NavLink to="/" className={mobileNavLinkClass} end>
                      Home
                    </NavLink>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <NavLink to="/services" className={mobileNavLinkClass}>
                      Services
                    </NavLink>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <NavLink to="/gallery" className={mobileNavLinkClass}>
                      Gallery
                    </NavLink>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <NavLink to="/booking" className={mobileNavLinkClass}>
                      Booking
                    </NavLink>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <NavLink to="/contact" className={mobileNavLinkClass}>
                      Contact
                    </NavLink>
                  </DrawerClose>
                </nav>

                {/* Mobile Buttons */}
                <div className="space-y-3">
                  {!loading && (
                    <>
                      {(!isAuthenticated || !isAdmin) && (
                        // Show Book Date for unauthenticated and customer users
                        <DrawerClose asChild>
                          <Button asChild variant="hero" size="lg" className="w-full">
                            <Link to="/booking" aria-label="Book your wedding event">
                              Book Your Date
                            </Link>
                          </Button>
                        </DrawerClose>
                      )}
                      {!isAuthenticated ? (
                        // User is logged out - show Login button
                        <DrawerClose asChild>
                          <Button asChild variant="hero" size="lg" className="w-full">
                            <Link to="/auth" aria-label="Login">
                              Login
                            </Link>
                          </Button>
                        </DrawerClose>
                      ) : isAdmin ? (
                        // User is admin - show Dashboard and Logout buttons
                        <>
                          <DrawerClose asChild>
                            <Button asChild variant="hero" size="lg" className="w-full">
                              <Link to="/admin" aria-label="Dashboard">
                                Dashboard
                              </Link>
                            </Button>
                          </DrawerClose>
                          <Button variant="outline" size="lg" className="w-full" onClick={handleLogout}>
                            Logout
                          </Button>
                        </>
                      ) : (
                        // User is customer - show Logout button only
                        <Button variant="outline" size="lg" className="w-full" onClick={handleLogout}>
                          Logout
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
