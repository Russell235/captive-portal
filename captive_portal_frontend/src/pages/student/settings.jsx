import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { activeSessions } from "@/lib/mock-data";
import studentService from "@/lib/services/student.service";
import {
  User,
  Shield,
  Bell,
  Palette,
  MonitorSmartphone,
  XCircle,
  LogOut,
} from "lucide-react";

export default function StudentSettings() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [prof, setProf] = useState({})
  // Mocks
  // const [sessions, setSessions] = useState(
  //   activeSessions.filter((s) => s.student === "Eleanor Vance"),
  // );
  const [notifs, setNotifs] = useState({
    email: true,
    portal: true,
    bandwidth: true,
    maintenance: false,
    events: false,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const profile = await studentService.getStudentProfile().catch(() => null);
        setProf(profile)
        // TODO: if backend had session endpoints for student we'd fetch them here
        if (!mounted) return;
        // optionally set user defaults from profile
        if (prof) {
          // set any defaults like display name etc. if inputs were controlled
        }
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

  const handleSave = (e) => {
    e.preventDefault();
    // example: persist settings to backend if endpoint exists
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleRevoke = (id) => {
    // setSessions(sessions.filter((s) => s.id !== id));
    toast({
      title: "Session Terminated",
      description: "The selected device has been disconnected.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-10 w-full rounded-md mb-6" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20 md:pb-0 max-w-4xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and security.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full flex flex-col">
        <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted rounded-xl gap-1">
          <TabsTrigger
            value="profile"
            className="py-2.5 data-[state=active]:shadow-sm rounded-lg flex flex-col sm:flex-row gap-2"
          >
            <User className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="py-2.5 data-[state=active]:shadow-sm rounded-lg flex flex-col sm:flex-row gap-2"
          >
            <Shield className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="py-2.5 data-[state=active]:shadow-sm rounded-lg flex flex-col sm:flex-row gap-2"
          >
            <Bell className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="py-2.5 data-[state=active]:shadow-sm rounded-lg flex flex-col sm:flex-row gap-2"
          >
            <Palette className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Update your display name and basic info.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      defaultValue={prof.full_name}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">University Email</Label>
                    <Input
                      id="email"
                      defaultValue={prof.email}
                      disabled
                      className="bg-muted text-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Managed by IT Department.
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="alt_phone">Recovery Phone</Label>
                    <Input
                      id="alt_phone"
                      defaultValue={prof.phone}
                      className="bg-background"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Portal access password. Does not change your university email
                password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="curr">Current Password</Label>
                  <Input id="curr" type="password" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conf">Confirm Password</Label>
                  <Input id="conf" type="password" className="bg-background" />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Devices currently logged into your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center p-4 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MonitorSmartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{s.device}</p>
                      <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                        <span>{s.ip}</span>
                        <span>•</span>
                        <span>{s.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(s.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 shrink-0"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Revoke
                  </Button>
                </div>
              ))} */}
              <Button
                variant="ghost"
                className="w-full text-muted-foreground gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out of all other devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what alerts you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important alerts via email.
                    </p>
                  </div>
                  <Switch
                    checked={notifs.email}
                    onCheckedChange={(c) => setNotifs({ ...notifs, email: c })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Portal Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show badges within the portal.
                    </p>
                  </div>
                  <Switch
                    checked={notifs.portal}
                    onCheckedChange={(c) => setNotifs({ ...notifs, portal: c })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Bandwidth Warnings
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when approaching data limits.
                    </p>
                  </div>
                  <Switch
                    checked={notifs.bandwidth}
                    onCheckedChange={(c) =>
                      setNotifs({ ...notifs, bandwidth: c })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Maintenance Notices
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts about system downtime.
                    </p>
                  </div>
                  <Switch
                    checked={notifs.maintenance}
                    onCheckedChange={(c) =>
                      setNotifs({ ...notifs, maintenance: c })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Campus Events
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Updates about university activities.
                    </p>
                  </div>
                  <Switch
                    checked={notifs.events}
                    onCheckedChange={(c) => setNotifs({ ...notifs, events: c })}
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how CampusNet looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme Selection</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "light" ? "border-primary bg-primary/5" : "border-border/50 bg-background hover:border-border"}`}
                  >
                    <div className="w-full h-20 bg-[#f8fafc] rounded-md border shadow-sm flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded shadow-sm border flex items-center justify-center">
                        <div className="w-6 h-1 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "dark" ? "border-primary bg-primary/5" : "border-border/50 bg-background hover:border-border"}`}
                  >
                    <div className="w-full h-20 bg-slate-950 rounded-md border border-slate-800 shadow-sm flex items-center justify-center">
                      <div className="w-12 h-12 bg-slate-900 rounded shadow-sm border border-slate-800 flex items-center justify-center">
                        <div className="w-6 h-1 bg-slate-700 rounded" />
                      </div>
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "system" ? "border-primary bg-primary/5" : "border-border/50 bg-background hover:border-border"}`}
                  >
                    <div className="w-full h-20 bg-gradient-to-r from-[#f8fafc] to-slate-950 rounded-md border border-slate-800 shadow-sm flex items-center justify-center">
                      <MonitorSmartphone className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-w-sm">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
