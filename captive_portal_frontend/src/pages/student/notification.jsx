import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications as mockNotifs } from "@/lib/mock-data";
import studentService from "@/lib/services/student.service";
import {
  Bell,
  BookOpen,
  AlertTriangle,
  Building,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

// Fonction alternative à date-fns pour calculer la distance temporelle
const formatDistanceToNow = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const filters = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "system", label: "System" },
  { id: "academic", label: "Academic" },
  { id: "alert", label: "Alerts" },
  { id: "campus", label: "Campus" },
  { id: "support", label: "Support" },
];

export default function StudentNotifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifs);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const notifs = await studentService.listNotifications();
        if (!mounted) return;
        setNotifications(notifs.length ? notifs : mockNotifs);
      } catch (err) {
        console.error(err);
        setNotifications(mockNotifs);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleMarkAllRead = () => {
    // mark each as read via API
    notifications.forEach((n) => {
      if (!n.is_read) studentService.markNotificationRead(n.id).catch(() => {});
    });
    setNotifications(
      notifications.map((n) => ({ ...n, is_read: true, read: true })),
    );
  };

  const toggleRead = (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif && !notif.is_read) {
      studentService.markNotificationRead(id).catch(() => {});
    }
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, is_read: true, read: true } : n,
      ),
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "system":
        return <Bell className="w-5 h-5" />;
      case "academic":
        return <BookOpen className="w-5 h-5" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5" />;
      case "campus":
        return <Building className="w-5 h-5" />;
      case "support":
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "system":
        return "bg-purple-500/10 text-purple-500";
      case "academic":
        return "bg-blue-500/10 text-blue-500";
      case "alert":
        return "bg-destructive/10 text-destructive";
      case "campus":
        return "bg-emerald-500/10 text-emerald-500";
      case "support":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20 md:pb-0 max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with campus and portal alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-background text-sm">
            {unreadCount} Unread
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all read
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Tabs
          value={activeFilter}
          onValueChange={setActiveFilter}
          className="w-full"
        >
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto flex-nowrap shrink-0">
            {filters.map((f) => (
              <TabsTrigger
                key={f.id}
                value={f.id}
                className="whitespace-nowrap px-3 sm:px-4"
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="glass-card border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-48 text-center">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">You're all caught up!</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                No notifications match this filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`glass-card border-border/50 transition-colors shadow-sm cursor-pointer ${!notif.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/50"}`}
                onClick={() => toggleRead(notif.id)}
              >
                <CardContent className="p-4 sm:p-5 flex gap-4">
                  <div className="relative shrink-0 mt-1">
                    {!notif.read && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background z-10" />
                    )}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(notif.type)}`}
                    >
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                      <h4
                        className={`text-base font-bold font-display truncate ${!notif.read ? "text-foreground" : "text-foreground/80"}`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1.5">
                        {formatDistanceToNow(notif.date)}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${!notif.read ? "text-foreground/90" : "text-muted-foreground"}`}
                    >
                      {notif.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
