import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartData } from "@/lib/mock-data";
import studentService from "@/lib/services/student.service";
import {
  Wifi,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Megaphone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [notificationsState, setNotificationsState] = useState([]);
  const [announcementsState, setAnnouncementsState] = useState([]);
  const [nextClass, setNextClass] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [prof, notifs, timetable] = await Promise.all([
          studentService.getStudentProfile().catch(() => null),
          studentService.listNotifications().catch(() => []),
          studentService.getMyTimetable().catch(() => []),
        ]);

        if (!mounted) return;
        setProfile(prof);

        // map notifications from backend shape to UI-friendly shape
        setNotificationsState(
          (notifs || []).map((n) => ({
            id: n.id,
            title: n.title,
            message: n.content || n.message,
            date: n.created_at || n.date,
            type: n.priority || "system",
            read: n.is_read || false,
          })),
        );

        // announcements from notifications endpoint as published announcements
        setAnnouncementsState(
          (notifs || []).map((a) => ({
            id: a.id,
            title: a.title,
            excerpt: (a.content || "").slice(0, 160),
            author: "Admin",
            date: a.created_at
              ? new Date(a.created_at).toLocaleDateString()
              : "",
            status: "Published",
          })),
        );

        // simple next class: first timetable entry
        const mappedTimetable = (timetable || []).map((r) => ({
          ...r,
          start: r.start_time || r.start,
          end: r.end_time || r.end,
          course: r.course_name || r.course || r.course_code,
        }));
        setNextClass(mappedTimetable[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20 md:pb-0"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || "Student"}. Here's your
            overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5"
          >
            <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
            Connected to Eduroam
          </Badge>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Session
            </CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              {profile?.is_active ? "Active" : "No session"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last login:{" "}
              {profile?.last_login_at
                ? new Date(profile.last_login_at).toLocaleString()
                : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bandwidth Used
            </CardTitle>
            <Wifi className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">1.2 GB</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-500 flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-1" /> 800 MB
              </span>
              <span className="text-xs text-blue-500 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 400 MB
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Class
            </CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-display truncate">
              {nextClass?.course || "No upcoming class"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="font-medium text-foreground">
                {nextClass?.professor || ""}
              </span>{" "}
              {nextClass ? `• ${nextClass.start || ""}` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 glass-card border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Internet Usage</CardTitle>
            <CardDescription>
              Your daily bandwidth consumption in MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData.bandwidth}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="glass-card border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Alerts
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-primary"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[300px] pr-2 space-y-4">
            {notificationsState.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className="flex gap-3 relative pb-4 border-b border-border/50 last:border-0 last:pb-0"
              >
                {!notif.read && (
                  <div className="absolute top-2 -left-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === "alert"
                      ? "bg-destructive/10 text-destructive"
                      : notif.type === "system"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {notif.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <div>
        <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-purple-500" />
          Campus Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcementsState
            .filter((a) => a.status === "Published")
            .slice(0, 2)
            .map((ann) => (
              <Card
                key={ann.id}
                className="glass-card border-border/50 hover:border-primary/30 transition-colors shadow-sm cursor-pointer group"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground text-xs font-medium"
                    >
                      {ann.author}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {ann.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {ann.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{ann.excerpt}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
