import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import adminService from "@/lib/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shell } from "@/components/ui/admin-components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function TimetablePage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [view, setView] = useState("table");
  const [showForm, setShowForm] = useState(false);
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");
  const [day, setDay] = useState("Monday");
  const [room, setRoom] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:30");
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const result = await adminService.listTimetable();
        if (mounted && Array.isArray(result) && result.length) setItems(result);
      } catch (err) {
        console.error("Error loading timetable:", err);
      }
    };
    void load();
    return () => (mounted = false);
  }, []);

  const addClass = async (e) => {
    e.preventDefault();
    if (!course.trim()) return;

    const payload = {
      class_name: course,
      room,
      day,
      start_time: start,
      end_time: end,
      color: "bg-indigo-500",
      // professor is not part of the timetable_entries table but keep it if backend accepts it
      professor,
    };

    try {
      await adminService.createTimetable(payload);
      const refreshed = await adminService.listTimetable();
      setItems(refreshed || []);
      setCourse("");
      setProfessor("");
      setRoom("");
      setShowForm(false);
      toast({
        title: "Class added",
        description: "The timetable has been updated.",
      });
    } catch (err) {
      console.error("Error adding class:", err);
      toast({ title: "Unable to add class", variant: "destructive" });
    }
  };

  const remove = async (id) => {
    try {
      await adminService.deleteTimetable(id);
      setItems((current) => current.filter((item) => item.id !== id));
      toast({ title: "Class removed" });
    } catch (err) {
      console.error("Error removing class:", err);
      toast({ title: "Unable to remove class", variant: "destructive" });
    }
  };
  return (
    <Shell
      kind="timetable"
      action={
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="w-4 h-4 mr-2" />
          Add class
        </Button>
      }
    >
      {showForm && (
        <Card className="glass-card border-primary/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Add a class</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={addClass}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              <div className="space-y-2">
                <Label>Course name</Label>
                <Input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="CS 401 - Algorithms"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Professor</Label>
                <Input
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="Dr. Ada Lovelace"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Eng 204"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start time</Label>
                <Input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End time</Label>
                <Input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 md:col-span-2 xl:col-span-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save class</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
        >
          Table view
        </Button>
        <Button
          variant={view === "days" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("days")}
        >
          Group by day
        </Button>
      </div>
      {view === "table" ? (
        <Card className="glass-card border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {[
                    "Course",
                    "Professor",
                    "Room",
                    "Day",
                    "Time",
                    "Color",
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
                {items.map((item) => (
                  <tr className="border-t border-border/50" key={item.id}>
                    <td className="px-5 py-3 font-medium">{item.course}</td>
                    <td className="px-5 py-3">{item.professor}</td>
                    <td className="px-5 py-3">{item.room}</td>
                    <td className="px-5 py-3">{item.day}</td>
                    <td className="px-5 py-3">
                      {item.start} – {item.end}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${item.color}`}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
            (dayName) => (
              <Card className="glass-card border-border/50" key={dayName}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{dayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items
                    .filter((i) => i.day === dayName)
                    .map((item) => (
                      <div className="rounded-lg bg-muted/40 p-3" key={item.id}>
                        <div className="flex justify-between gap-2">
                          <p className="font-medium text-sm">{item.course}</p>
                          <span
                            className={`w-2 h-2 rounded-full ${item.color}`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.start} – {item.end} · {item.room}
                        </p>
                      </div>
                    ))}
                  {items.filter((i) => i.day === dayName).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No classes scheduled.
                    </p>
                  )}
                </CardContent>
              </Card>
            ),
          )}
        </div>
      )}
    </Shell>
  );
}
