import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, BookOpen, Wifi, Monitor, Save } from "lucide-react";
import studentService from "@/lib/services/student.service";

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function getMyProfile() {
      const result = await studentService.getStudentProfile();
      setStudent(result);
      setLoading(false);
    }

    getMyProfile();
  }, []);

  const [formData, setFormData] = useState({
    phone: "+237 678990902",
    address: "messassi, Room 402",
    emergencyContact: "Jane Vance (Mother) - +237 699001122 ",
  });

  const handleSave = (e) => {
    e.preventDefault();
    async function save() {
      try {
        const payload = { phone: formData.phone };
        await studentService.updateStudentProfile(payload);
        toast.add({
          title: "Profile Updated",
          description: "Your changes have been saved successfully.",
        });
        // refresh profile
        const updated = await studentService.getStudentProfile();
        setStudent(updated);
      } catch (err) {
        toast.add({
          title: "Error",
          description: err.message || JSON.stringify(err),
        });
      }
    }
    save();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl md:col-span-2" />
          <Skeleton className="h-64 rounded-xl" />
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
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">
          Student Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal details and preferences.
        </p>
      </div>

      {/* Profile Header */}
      <Card className="glass-card border-border/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-purple-500/20" />
        <CardContent className="pt-12 pb-6 px-6 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarImage src={student.profile_image} alt="Profile Image" />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {student.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-display">
              {student.full_name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {student.department} • {student.matricule}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              Year {student.level}
            </Badge>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              {student.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Info Cards */}
          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{student.phone}</p>
                </div>
              </div>
              {/* <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Term Address</p>
                  <p className="text-sm font-medium">{formData.address}</p>
                </div>
              </div> */}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Academic & Network Info
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                <BookOpen className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">GPA / Advisor</p>
                  <p className="text-sm font-medium">2 / Dr.Keyampi Martial</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                <Monitor className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Registered Devices
                  </p>
                  <p className="text-sm font-medium">3 / 5 Allowed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 md:col-span-2">
                <Wifi className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Session IP
                  </p>
                  <p className="text-sm font-medium">
                    192.168.1.42 (Active for 2h 15m)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div>
          <Card className="glass-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Edit Information
              </CardTitle>
              <CardDescription>Update your contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={student.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="address">Term Address</Label>
                  <Input
                    id="address"
                    value={student.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="bg-background"
                  />
                </div> */}
                {/* <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="bg-background"
                  />
                </div> */}
                <Button type="submit" className="w-full mt-2 gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
