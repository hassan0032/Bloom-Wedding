
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  role: "admin" | "customer";
}

export const useAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndRole = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }
      setSession(session);
      const { user } = session;
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      if (roleError || !roleData) {
        setUser({ id: user.id, email: user.email ?? "", role: "customer" });
      } else {
        setUser({ id: user.id, email: user.email ?? "", role: roleData.role });
      }
      setLoading(false);
    };
    getSessionAndRole();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSessionAndRole();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return {
    session,
    user,
    loading,
    isAuthenticated,
    isAdmin,
  };
};
