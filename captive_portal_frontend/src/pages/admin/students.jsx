import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Filter,
  MoreHorizontal,
  Plus,
  Shield,
 Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Shell } from "@/components/ui/admin-components";
import { StatCards } from "@/components/ui/admin-components";
import { Toolbar } from "@/components/ui/admin-components";
import { SearchBox } from "@/components/ui/admin-components";
import { StatusBadge } from "@/components/ui/admin-components";
import adminService from "@/lib/services/admin.service";

const emptyStudentForm = {
  matricule: "",
  full_name: "",
  email: "",
  phone: "",
  classname: "",
  department: "",
  level: "",
  is_active: true,
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(emptyStudentForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const filtered = students.filter((s) => {
    const value = s.status ?? (s.is_active === true ? "Active" : "Inactive");
    const matchesStatus = status === "All" || value === status;
    const searchText =
      `${s.full_name ?? ""} ${s.matricule ?? ""} ${s.department ?? ""} ${s.classname ?? ""}`.toLowerCase();

    return matchesStatus && searchText.includes(search.toLowerCase());
  });
  const active = students.filter((s) => s.is_active === true).length;

  const fetchStudents = async () => {
    try {
      const response = await adminService.listStudents();
      setStudents(response);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleDelete = async (student) => {
    if (!confirm(`Supprimer l'élève ${student.full_name} (${student.matricule}) ?`)) {
      return;
    }
    try {
      await adminService.deleteStudent(student.id);
      await fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert(
        error.response?.data?.message ||
          "Impossible de supprimer cet élève."
      );
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await adminService.createStudent(formData);
      await fetchStudents();
      setFormData(emptyStudentForm);
      setOpen(false);
    } catch (error) {
      console.error("Error creating student:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to add the student. Please verify the information.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell
      kind="students"
      action={
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add student
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="sm:max-w-xl h-[90vh] p-0 flex flex-col"
          >
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col overflow-hidden"
            >
              <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/60">
                <SheetTitle>Add a student</SheetTitle>
                <SheetDescription>
                  Enter the student details to create a new profile.
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 px-4 py-4 md:grid-cols-2 overflow-y-auto flex-1">
                {/* <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={handleFieldChange("id")}
                    placeholder="STU-001"
                    required
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={handleFieldChange("level")}
                    placeholder="300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    value={formData.matricule}
                    onChange={handleFieldChange("matricule")}
                    placeholder="2024-001"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleFieldChange("full_name")}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange("email")}
                    placeholder="student@school.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleFieldChange("phone")}
                    placeholder="+237 600 000 000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classname">Class name</Label>
                  <Input
                    id="classname"
                    value={formData.classname}
                    onChange={handleFieldChange("classname")}
                    placeholder="CS-301"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={handleFieldChange("department")}
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="px-4 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <SheetFooter className="px-4 py-4 border-t border-border/60 bg-background/95 backdrop-blur-sm mt-auto flex-col-reverse sm:flex-row sm:justify-end gap-2 sticky bottom-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save student"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      }
    >
      <StatCards
        items={[
          {
            label: "Total Students",
            value: `${students.length}`,
            helper: "Across all faculties",
            icon: Users,
          },
          {
            label: "Active",
            value: `${active}`,
            helper: "Currently enrolled",
            icon: CheckCircle2,
          },
          {
            label: "Suspended",
            value: `${students.filter((s) => s.is_active === false).length}`,
            helper: "Require review",
            icon: Shield,
          },
          {
            label: "Average GPA",
            value:
              students.length > 0
                ? (
                    students.reduce((sum, s) => sum + (Number(s.gpa) || 0), 0) /
                    students.length
                  ).toFixed(2)
                : "0.00",
            helper: "Out of 4.0",
            icon: BarChart3,
          },
        ]}
      />

      <Toolbar>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by name, matricule, or department"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44 bg-background/70">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Active", "Inactive", "Suspended"].map((value) => (
              <SelectItem value={value} key={value}>
                {value} students
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      <Card className="glass-card border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                {[
                  "Student",
                  "Matricule",
                  "Department",
                  "Level",
                  "Status",
                  "",
                ].map((heading) => (
                  <th key={heading} className="text-left font-medium px-5 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => {
                const initials = (student.full_name || "ST")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase();

                return (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    key={student.id || student.matricule || index}
                    className="border-t border-border/50 hover:bg-muted/30"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {student.matricule}
                    </td>
                    <td className="px-5 py-3">{student.department}</td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary">{student.level}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        value={student.is_active ? "Active" : "Inactive"}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student)}
                        aria-label={`Supprimer ${student.full_name}`}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-muted-foreground border-t border-border/50">
          Showing {filtered.length} of {students.length} students
        </div>
      </Card>
    </Shell>
  );
}
