import { useCallback, useEffect, useState } from "react";
import { Download, FileText, Trash2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shell } from "@/components/ui/admin-components";
import { Toolbar } from "@/components/ui/admin-components";
import adminService from "@/lib/services/admin.service";

export default function DocumentsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [selected, setSelected] = useState([]);

  const fetchDocuments = useCallback(async () => {
    try {
      const result = await adminService.listDocuments();
      setItems(result || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({ title: "Unable to load documents", variant: "destructive" });
    }
  }, [toast]);

    useEffect(() => {
    void fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = items.filter(
    (d) =>
      (category === "All" || d.category === category) &&
      (type === "All" || d.type === type),
  );

  const toggle = (id) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
    );

  const handleDeleteDocument = async (id) => {
    try {
      await adminService.deleteDocument(id);
      setItems((current) => current.filter((doc) => doc.id !== id));
      setSelected((current) => current.filter((value) => value !== id));
      toast({ title: "Document deleted" });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({ title: "Unable to delete document", variant: "destructive" });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selected.map((id) => adminService.deleteDocument(id)));
      setItems((current) =>
        current.filter((doc) => !selected.includes(doc.id)),
      );
      setSelected([]);
      toast({ title: "Documents deleted" });
    } catch (error) {
      console.error("Error deleting selected documents:", error);
      toast({
        title: "Unable to delete selected documents",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAccess = async (doc, checked) => {
    try {
      const payload = {
        ...doc,
        is_public: checked,
        access: checked ? "public" : "private",
      };

      const response = await adminService.updateDocument(doc.id, payload);
      setItems((current) =>
        current.map((item) =>
          item.id === doc.id ? { ...item, ...response } : item,
        ),
      );
      toast({ title: checked ? "Document published" : "Document restricted" });
    } catch (error) {
      console.error("Error updating document:", error);
      toast({ title: "Unable to update document", variant: "destructive" });
    }
  };

  return (
    <Shell
      kind="documents"
      action={
        <Button
          variant="outline"
          onClick={() => toast({ title: "Upload feature coming soon" })}
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload document
        </Button>
      }
    >
      <Toolbar>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {["Official", "Academic", "Finance", "Resources"].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "pdf", "doc", "image"].map((v) => (
              <SelectItem key={v} value={v}>
                {v === "All" ? "All types" : v.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm text-muted-foreground">
              {selected.length} selected
            </span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteSelected}
            >
              Delete selected
            </Button>
          </div>
        )}
      </Toolbar>
      <Card className="glass-card border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "",
                  "Document",
                  "Size",
                  "Date",
                  "Category",
                  "Type",
                  "Access",
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
              {visible.map((doc) => (
                <tr
                  className="border-t border-border/50 hover:bg-muted/30"
                  key={doc.id}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(doc.id)}
                      onChange={() => toggle(doc.id)}
                      className="accent-primary"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{doc.size}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {doc.date}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary">{doc.category}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline">{doc.type.toUpperCase()}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Switch
                      checked={Boolean(
                        doc.is_public ?? doc.access === "public",
                      )}
                      onCheckedChange={(checked) =>
                        handleUpdateAccess(doc, checked)
                      }
                    />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({ title: "Download started" })}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-xs text-muted-foreground border-t border-border/50">
          Showing {visible.length} documents
        </div>
      </Card>
    </Shell>
  );
}
