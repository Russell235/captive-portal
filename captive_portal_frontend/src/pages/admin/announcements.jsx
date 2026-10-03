import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { Shell } from "@/components/ui/admin-components";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/admin-components";
import { StatusBadge } from "@/components/ui/admin-components";
import adminService from "@/lib/services/admin.service";

const initialForm = {
  title: "",
  content: "",
  priority: "Medium",
  published: true,
  expires_at: "",
};

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const result = await adminService.listAnnouncements();
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({ title: "Unable to load announcements", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  const visible = items.filter((item) => {
    const status = item.published ? "Published" : "Draft";
    return filter === "All" || status === filter;
  });

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setForm({
      title: item.title || "",
      content: item.content || "",
      priority: item.priority || "Medium",
      published: Boolean(item.published),
      expires_at: item.expires_at || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        priority: form.priority,
        published: Boolean(form.published),
        expires_at: form.expires_at || null,
      };

      if (editingId) {
        const response = await adminService.updateAnnouncement(
          editingId,
          payload,
        );
        setItems((current) =>
          current.map((announcement) =>
            announcement.id === editingId
              ? { ...announcement, ...response }
              : announcement,
          ),
        );
        toast({ title: "Announcement updated" });
      } else {
        await adminService.createAnnouncement(payload);
        toast({ title: "Announcement saved" });
      }

      resetForm();
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast({
        title: editingId
          ? "Unable to update announcement"
          : "Unable to save announcement",
        description:
          error.response?.data?.message ||
          "Please verify the announcement details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?",
    );

    if (!confirmed) return;

    try {
      await adminService.deleteAnnouncement(id);
      setItems((current) => current.filter((a) => a.id !== id));
      toast({ title: "Announcement deleted" });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Unable to delete announcement",
        variant: "destructive",
      });
    }
  };

  return (
    <Shell
      kind="announcements"
      action={
        <Button onClick={openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          New announcement
        </Button>
      }
    >
      {showForm && (
        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Edit announcement" : "Create announcement"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  placeholder="A clear headline for students"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Share the details..."
                  className="min-h-28"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Publication status</Label>
                  <Select
                    value={form.published ? "Published" : "Draft"}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        published: value === "Published",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expiry date</Label>
                <Input
                  type="date"
                  value={form.expires_at ? form.expires_at.slice(0, 10) : ""}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      expires_at: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                      ? "Update announcement"
                      : "Save announcement"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="flex flex-wrap gap-2">
        {["All", "Published", "Draft"].map((v) => (
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
      {visible.length === 0 ? (
        <EmptyState title="No announcements found" />
      ) : (
        <div className="grid gap-4">
          {visible.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id}
            >
              <Card className="glass-card border-border/50 hover:bg-muted/20 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <StatusBadge
                          value={item.published ? "Published" : "Draft"}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.priority || "Medium"} priority
                        </span>
                        {item.expires_at && (
                          <span className="text-xs text-muted-foreground">
                            Expires{" "}
                            {new Date(item.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h2 className="font-semibold text-lg">{item.title}</h2>
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </Shell>
  );
}
