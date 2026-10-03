import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Trash2,
  Power,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";
import { examService } from "@/lib/services/exam.service";

export default function ExamsAdmin() {
  const [sessions, setSessions] = useState([]);
  const [options, setOptions] = useState({ departments: [], classes: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    start_time: "",
    end_time: "",
    affected_departments: [],
    affected_classes: [],
    bandwidth_boost: 2.0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, optionsData] = await Promise.all([
        examService.list(),
        examService.getOptions(),
      ]);
      setSessions(sessionsData);
      setOptions(optionsData);
    } catch (err) {
      console.error("Failed to load exam sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await examService.create({
        ...form,
        affected_departments:
          form.affected_departments.length > 0
            ? form.affected_departments
            : null,
        affected_classes:
          form.affected_classes.length > 0 ? form.affected_classes : null,
      });
      setShowForm(false);
      setForm({
        name: "",
        start_time: "",
        end_time: "",
        affected_departments: [],
        affected_classes: [],
        bandwidth_boost: 2.0,
      });
      loadData();
    } catch (err) {
      console.error("Failed to create session:", err);
      alert(err?.response?.data?.message || "Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette session ?")) return;
    try {
      await examService.delete(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const toggleActive = async (session) => {
    try {
      await examService.update(session.id, {
        is_active: !session.is_active,
      });
      loadData();
    } catch (err) {
      console.error("Failed to toggle:", err);
    }
  };

  const isActiveNow = (session) => {
    const now = new Date();
    const start = new Date(session.start_time);
    const end = new Date(session.end_time);
    return session.is_active && now >= start && now <= end;
  };

  const formatDateTime = (iso) => {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleArrayItem = (arr, item) => {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">
              Exam Sessions
            </h1>
            <p className="text-muted-foreground mt-1">
              Boost bandwidth for students during exams.
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Exam Session</CardTitle>
            <CardDescription>
              Boost will be applied to affected students during this period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Session name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Examen Informatique S1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm({ ...form, start_time: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End</Label>
                  <Input
                    type="datetime-local"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm({ ...form, end_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bandwidth boost (×)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={form.bandwidth_boost}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bandwidth_boost: parseFloat(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Multiplier applied to students' base bandwidth.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Affected departments (leave empty = all)</Label>
                <div className="flex flex-wrap gap-2">
                  {options.departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          affected_departments: toggleArrayItem(
                            form.affected_departments,
                            dept
                          ),
                        })
                      }
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        form.affected_departments.includes(dept)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                  {options.departments.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Aucun département
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Affected classes (leave empty = all)</Label>
                <div className="flex flex-wrap gap-2">
                  {options.classes.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          affected_classes: toggleArrayItem(
                            form.affected_classes,
                            cls
                          ),
                        })
                      }
                      className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                        form.affected_classes.includes(cls)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                  {options.classes.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Aucune classe
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions ({sessions.length})</CardTitle>
          <CardDescription>
            Active sessions boost bandwidth automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">
              Loading...
            </p>
          ) : sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No exam sessions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const active = isActiveNow(session);
                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      active
                        ? "border-green-300 bg-green-50/50"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{session.name}</h3>
                          {active && (
                            <Badge className="bg-green-600 text-white">
                              <Zap className="w-3 h-3 mr-1" />
                              Active now
                            </Badge>
                          )}
                          {!session.is_active && (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(session.start_time)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDateTime(session.end_time)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            ×{session.bandwidth_boost}
                          </span>
                        </div>
                        {(session.affected_departments ||
                          session.affected_classes) && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {session.affected_departments?.map((d) => (
                              <Badge key={d} variant="outline">
                                {d}
                              </Badge>
                            ))}
                            {session.affected_classes?.map((c) => (
                              <Badge key={c} variant="outline">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleActive(session)}
                          title={session.is_active ? "Disable" : "Enable"}
                        >
                          <Power
                            className={`w-4 h-4 ${
                              session.is_active ? "text-green-600" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(session.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
