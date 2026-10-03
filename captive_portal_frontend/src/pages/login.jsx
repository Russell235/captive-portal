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
import { ArrowLeft, Loader2 } from "lucide-react";
import { apiClient, getStoredAuth, saveAuthSession } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
    // Récupérer le token FAS depuis l'URL (?fas=...)
    const params = new URLSearchParams(window.location.search);
    const fasToken = params.get("fas");
    if (fasToken) {
      sessionStorage.setItem("fasToken", fasToken);
      console.log("[FAS] Token stored:", fasToken.substring(0, 30) + "...");
    }

    const { token, role } = getStoredAuth();
    if (token && role === "student") {
      navigate("/student/dashboard", { replace: true });
    }
    if (token && role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const matricule = e.target.matricule.value.trim();
    const password = e.target.password.value;

    try {
            const fasToken = sessionStorage.getItem("fasToken");

      const response = await apiClient().post("/auth/student/login", {
        matricule,
        password,
        fas: fasToken,
      });
      const { token, student } = response.data;
      saveAuthSession({ token, role: "student", user: student });
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid matricule or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px]" />
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

        <Card className="border-border/50 shadow-2xl shadow-primary/5 glass-card bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 mb-2">
              <span className="font-bold text-3xl font-display">C</span>
            </div>
            <CardTitle className="text-2xl font-display font-bold">
              Student Sign In
            </CardTitle>
            <CardDescription className="text-base">
              Use your university matricule ID to access CampusNet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="matricule">Matricule ID</Label>
                <Input
                  id="matricule"
                  name="matricule"
                  placeholder="e.g. ICTU20233902"
                  required
                  className="h-12 bg-background/50"
                  defaultValue="ICTU20233902"
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
                  placeholder="Enter your password"
                  required
                  className="h-12 bg-background/50 font-mono"
                  defaultValue="ICT2023"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Having trouble signing in?</p>
              <a
                href="#"
                className="text-primary hover:underline font-medium mt-1 inline-block"
              >
                Contact IT Support
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
