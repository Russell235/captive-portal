import { useState, useEffect } from "react";

import { Plus } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
import adminService from "@/lib/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shell } from "@/components/ui/admin-components";
import { StatusBadge } from "@/components/ui/admin-components";

export default function AdministratorsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const result = await adminService.listAdministrators();
        if (mounted && Array.isArray(result) && result.length) setItems(result);
      } catch (err) {
        console.error("Error loading administrators:", err);
      }
    };
    void load();
    return () => (mounted = false);
  }, []);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Network Admin");
  const [department, setDepartment] = useState("IT Operations");
  const visible = items.filter((a) => filter === "All" || a.role === filter);
  const add = async (e) => {
    e.preventDefault();
    await adminService.createAdministrator({
      username,
      full_name: fullname,
      password,
      email,
      role
    })
    setShowForm(false);
    setFullName("");
    setUsername("")
    setPassword("")
    setEmail("");
    toast({ title: "Administrator added" });
  };
  return (
    <Shell
      kind="administrators"
      action={
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4 mr-2" />
          Add admin
        </Button>
      }
    >
      {showForm && (
        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Add administrator</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={add}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Super Admin",
                      "Network Admin",
                      "Support Manager",
                      "Content Manager",
                    ].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 md:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create admin</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="flex flex-wrap gap-2">
        {[
          "All",
          "Super Admin",
          "Network Admin",
          "Support Manager",
          "Content Manager",
        ].map((v) => (
          <Button
            key={v}
            size="sm"
            variant={filter === v ? "default" : "outline"}
            onClick={() => setFilter(v)}
          >
            {v}
          </Button>
        ))}
      </div>
      <Card className="glass-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Administrator",
                  "Role",
                  "Department",
                  "Status",
                  "Last login",
                  "",
                ].map((h) => (
                  <th
                    className="text-left px-5 py-3 text-muted-foreground font-medium"
                    key={h}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((admin) => (
                <tr className="border-t border-border/50" key={admin.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {admin.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {admin.role && <StatusBadge value={admin.role} />}
                    
                  </td>
                  <td className="px-5 py-3">{admin.department}</td>
                  <td className="px-5 py-3">
                    {admin.status && <StatusBadge value={admin.status} />}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {/* {formatDistanceToNow(new Date(admin.lastLogin), {
                      addSuffix: true,
                    })} */}
                    {admin.lastLogin}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setItems((current) =>
                          current.map((a) =>
                            a.id === admin.id
                              ? {
                                  ...a,
                                  status:
                                    a.status === "Active"
                                      ? "Inactive"
                                      : "Active",
                                }
                              : a,
                          ),
                        );
                        toast({ title: "Administrator status updated" });
                      }}
                    >
                      {admin.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
