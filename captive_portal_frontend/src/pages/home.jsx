import {
  Wifi,
  BookOpen,
  Clock,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";  
  
export default function Home() {
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fasToken = params.get("fas");
    if (fasToken) {
      sessionStorage.setItem("fasToken", fasToken);
      console.log("[FAS] Token stored from Home:", fasToken.substring(0, 30) + "...");
    }
  }, []);
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground flex flex-col">
      {/* Navbar */}
      <nav className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
              <span className="font-bold text-xl font-display">C</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              CampusNet
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <a
              href="/admin/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block mr-4"
            >
              Admin Portal
            </a>
            <a href="/login">
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                Connect <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-3xl opacity-50 -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>

          <div className="container mx-auto px-4 pt-32 pb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                Welcome to the new digital gateway
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight text-foreground max-w-4xl mx-auto leading-tight mb-8">
                Your university life, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                  fast & secure for students.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Experience high-speed campus Wi-Fi, manage your timetable,
                access academic resources.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/login">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                  >
                    Student Login
                  </Button>
                </a>
                <a href="/faq">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-base bg-background/50 backdrop-blur-sm border-border/50"
                  >
                    Connection Guide
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Everything you need
              </h2>
              <p className="text-muted-foreground text-lg">
                Designed for the modern student experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Wifi,
                  title: "Blazing Fast Wi-Fi",
                  desc: "Connect multiple devices to Eduroam with enterprise-grade security and speed.",
                },
                {
                  icon: Clock,
                  title: "Smart Timetable",
                  desc: "Your schedule syncs automatically. Never miss a class or a room change.",
                },
                {
                  icon: BookOpen,
                  title: "Resource Library",
                  desc: "Access essential academic documents, past papers, and university policies.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Access",
                  desc: "Single sign-on via your matricule ID for all university digital services.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile First",
                  desc: "Check notifications and scan QR codes right from your phone.",
                },
                {
                  icon: Zap,
                  title: "Instant Support",
                  desc: "Submit IT tickets and track their resolution in real-time.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-8 hover:-translate-y-1 transition-transform"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-80">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="font-bold font-display">C</span>
            </div>
            <span className="font-medium">CampusNet Portal © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
