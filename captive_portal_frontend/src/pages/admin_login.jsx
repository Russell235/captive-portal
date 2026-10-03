import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { apiClient, getStoredAuth, saveAuthSession } from "@/lib/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { token, role } = getStoredAuth();
    console.log(role);
    if (token && role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
    if (token && role === "student") {
      navigate("/student/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const username = e.target.admin_id.value.trim();
    const password = e.target.password.value;

    try {
      const response = await apiClient().post("/auth/admin/login", {
        username,
        password,
      });

      const { token, admin } = response.data;
      saveAuthSession({ token, role: "admin", user: admin });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] rounded-full bg-destructive/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal
        </Link>

        <Card className="border-border/50 shadow-2xl shadow-black/5 glass-card bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 mx-auto flex items-center justify-center text-destructive shadow-sm mb-2 border border-destructive/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-display font-bold">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-base">
              Authorized IT personnel only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin_id">Admin ID</Label>
                <Input
                  id="admin_id"
                  name="admin_id"
                  placeholder="admin.name"
                  required
                  className="h-12 bg-background/50 font-mono"
                  defaultValue="sys.admin"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-12 bg-background/50 font-mono tracking-widest"
                  defaultValue="password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="default"
                className="w-full h-12 text-base mt-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Authenticate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
