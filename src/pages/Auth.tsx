import { useEffect, useState } from "react";
import Seo from "@/components/layout/Seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Mail, Key, Star, Heart, Award, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/Hero3.jpg";

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      return toast({ title: "Missing fields", description: "Please enter both email and password." });
    }
    if (mode === 'login') {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        return toast({ title: "Login failed", description: error.message });
      }
      toast({ title: "Logged in" });
      const userId = data?.user?.id;
      if (userId) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single();
        if (roleData?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        return toast({ title: "Registration failed", description: error.message });
      }
      toast({ title: "Registration successful", description: "Check your email for a confirmation link." });
      setMode('login');
    }
  };

  const quickStats = [
    { number: "150+", label: "Weddings Managed", icon: Heart },
    { number: "98%", label: "Client Satisfaction", icon: Award },
    { number: "24/7", label: "System Uptime", icon: Clock },
    { number: "5.0", label: "Platform Rating", icon: Star }
  ];


  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <>
      <section
        className="relative overflow-hidden"
        aria-label={mode === 'register' ? "Registration hero section with floral background" : "Sign In hero section with floral background"}
      >
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(180deg, hsl(var(--background) / 0.3), hsl(var(--background))), url(${heroImage})`,
            backgroundSize: "cover",
          }}
        />
        <div className="container-padded relative mx-auto flex min-h-[50vh] items-center py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              {mode === 'register' ? 'Create Your Bloom Weddings Account' : 'Sign In to Your Account'}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                {mode === 'register'
                ? 'Register to unlock personalized wedding planning, easy bookings, and exclusive features for your big day.'
                : 'Sign in to manage your events, and enjoy seamless wedding planning with Bloom.'}
            </p>
          </div>
        </div>
      </section>

      <main className="container-padded py-12">
        <Seo
          title="Sign In | Bloom Weddings"
          description="Secure access to Bloom Weddings admin."
          canonicalPath="/auth"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="lg:order-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {mode === 'register' ? 'Register' : 'Sign In'}
              </h2>
              <p className="text-muted-foreground">
                {mode === 'register'
                  ? 'Fill in your details to create a new account.'
                  : 'Enter your credentials to access your account.'}
              </p>
            </div>

            <Card className="p-6">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="mt-2"
                    autoComplete="email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 inset-y-0 z-10 px-3 py-2 hover:bg-transparent"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 gap-2">
                  <Button type="submit" variant="hero" className="hover-float" disabled={loading}>
                    {loading ? (mode === 'login' ? "Signing in…" : "Registering…") : (mode === 'login' ? "Sign In" : "Register")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  >
                    {mode === 'login' ? "New user? Register" : "Have an account? Sign In"}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Secure Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Your login credentials are encrypted and secure. We never store your password in plain text.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:order-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Platform Overview</h2>
              <p className="text-muted-foreground mb-6">
                Trusted by wedding planners nationwide for efficient event management.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-muted/30 rounded-lg hover-float">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Having trouble accessing your account? Our support team is here to help.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>support@bloomweddings.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Auth;
