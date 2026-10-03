import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gauge, Search, Users, Wifi } from "lucide-react";
import { bandwidthService } from "@/lib/services/bandwidth.service";

const PROFILE_COLORS = {
  restricted: "bg-red-100 text-red-800 border-red-200",
  normal: "bg-blue-100 text-blue-800 border-blue-200",
  priority: "bg-green-100 text-green-800 border-green-200",
};

export default function BandwidthAdmin() {
  const [profiles, setProfiles] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profilesData, studentsData] = await Promise.all([
        bandwidthService.listProfiles(),
        bandwidthService.listStudents(),
      ]);
      setProfiles(profilesData);
      setStudents(studentsData);
    } catch (err) {
      console.error("Failed to load bandwidth data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = async (studentId, newProfile) => {
    try {
      setUpdating(studentId);
      await bandwidthService.updateStudentProfile(studentId, newProfile);
      // Mettre à jour localement
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, bandwidth_profile: newProfile } : s
        )
      );
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Erreur lors du changement de profil");
    } finally {
      setUpdating(null);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.matricule?.toLowerCase().includes(q) ||
      s.class_name?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Gauge className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">
            Bandwidth Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student bandwidth profiles and quality of service.
          </p>
        </div>
      </div>

      {/* Profiles cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {profile.profile_name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={PROFILE_COLORS[profile.profile_name] || ""}
                >
                  Active
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Download</span>
                  <span className="font-mono font-semibold">
                    {profile.download_kbps >= 1024
                      ? `${(profile.download_kbps / 1024).toFixed(1)} Mbps`
                      : `${profile.download_kbps} kbps`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Upload</span>
                  <span className="font-mono font-semibold">
                    {profile.upload_kbps >= 1024
                      ? `${(profile.upload_kbps / 1024).toFixed(1)} Mbps`
                      : `${profile.upload_kbps} kbps`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Students ({filteredStudents.length})
              </CardTitle>
              <CardDescription>
                Assign a bandwidth profile to each student.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">
              Loading...
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No students found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 font-medium">Matricule</th>
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Class</th>
                    <th className="py-3 px-4 font-medium">Department</th>
                    <th className="py-3 px-4 font-medium">Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs">
                        {student.matricule}
                      </td>
                      <td className="py-3 px-4">{student.full_name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {student.class_name || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {student.department || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={student.bandwidth_profile || "normal"}
                          onValueChange={(value) =>
                            handleProfileChange(student.id, value)
                          }
                          disabled={updating === student.id}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {profiles.map((p) => (
                              <SelectItem
                                key={p.profile_name}
                                value={p.profile_name}
                              >
                                <span className="capitalize">
                                  {p.profile_name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
