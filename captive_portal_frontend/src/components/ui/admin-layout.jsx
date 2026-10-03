import {
  Link,
  Outlet,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
// import { ThemeToggle } from "./theme-toggle";

import {
  LayoutDashboard,
  // CalendarDays,
  Bell,
  FileText,
  Settings,
  LogOut,
  Search,
  Menu,
  Users,
  Wifi,
  Server,
  Gauge,
  Megaphone,
  Ticket,
  BookOpen,
  Shield,
  BarChart3,
  Activity
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAuthSession, getStoredAuth } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/sessions", label: "Sessions", icon: Wifi },
  { href: "/admin/devices", label: "Devices", icon: Server },
{ href: "/admin/bandwidth", label: "Bandwidth", icon: Gauge },
{ href: "/admin/exams", label: "Exam Sessions", icon: BookOpen },
  // { href: "/admin/timetable", label: "Timetable", icon: CalendarDays },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/administrators", label: "Administrators", icon: Shield },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/logs", label: "Logs", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { token, role, user } = getStoredAuth();

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    clearAuthSession();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col border-r bg-card/50 backdrop-blur-xl z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
          <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <span className="font-bold text-lg">C</span>
            </div>
            CampusNet
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />

                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-border/50 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
      {/* ================= MAIN AREA ================= */}
      <div className="min-h-screen md:ml-64 flex flex-col">
        {/* ================= TOP NAVBAR ================= */}

        <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
          {/* Mobile Menu */}
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                {/* Mobile Logo */}

                <div className="h-16 flex items-center px-6 border-b border-border/50">
                  <div className="font-display font-bold text-xl tracking-tight flex items-center gap-2 text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                      <span className="font-bold text-lg">C</span>
                    </div>
                    CampusNet
                  </div>
                </div>

                {/* Mobile Navigation */}

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />

                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            <div className="font-display font-bold text-lg text-primary">
              CampusNet
            </div>
          </div>

          {/* Search */}

          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search resources, documents..."
              className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background transition-colors"
            />
          </div>

          {/* User Area */}

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <Link
              to="/student/notifications"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
            >
              <Bell className="w-5 h-5" />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
            </Link>

            <div className="w-px h-6 bg-border/50 hidden md:block mx-2" />

            <Link
              to="/student/profile"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium leading-none">
                  {user?.full_name || user?.fullName || user?.name || "Student"}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.role || "IT Operator"}
                </p>
              </div>

              <Avatar className="w-9 h-9 border border-border/50">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {(user?.full_name || user?.fullName || user?.name || "ST")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden border-t bg-card/80 backdrop-blur-xl sticky bottom-0 z-20">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[64px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${active ? "fill-primary/20" : ""}`}
                />

                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
