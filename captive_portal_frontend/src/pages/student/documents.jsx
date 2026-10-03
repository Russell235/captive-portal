import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documents as mockDocs } from "@/lib/mock-data";
import studentService from "@/lib/services/student.service";
import {
  Search,
  FileText,
  File,
  Image as ImageIcon,
  Download,
  UploadCloud,
  LayoutGrid,
  List,
} from "lucide-react";

// Fallback simple si le hook useToast n'est pas installé
const useToast = () => ({
  toast: ({ title, description }) => alert(`${title}\n${description || ""}`),
});

export default function StudentDocuments() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // Suppress TypeScript generics for JSX
  const { toast } = useToast();
  const [documents, setDocuments] = useState(mockDocs);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const docs = await studentService.listDocuments();
        if (!mounted) return;
        setDocuments(docs.length ? docs : mockDocs);
      } catch (err) {
        console.error(err);
        setDocuments(mockDocs);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDownload = (name) => {
    toast({
      title: "Download Started",
      description: `Downloading ${name}...`,
    });
    const doc = documents.find((d) => d.name === name);
    if (doc && doc.file_url) window.open(doc.file_url, "_blank");
  };

  const filteredDocs = documents.filter(
    (d) =>
      (category === "All" || d.category === category) &&
      d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-destructive" />;
      case "doc":
        return <File className="w-8 h-8 text-blue-500" />;
      case "image":
        return <ImageIcon className="w-8 h-8 text-emerald-500" />;
      default:
        return <File className="w-8 h-8 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-2" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
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
          Documents
        </h1>
        <p className="text-muted-foreground mt-1">
          Access and download official university resources.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Official">Official</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Resources">Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 shrink-0 bg-secondary/50 rounded-lg p-1 border border-border">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground font-medium">
        Showing {filteredDocs.length} document(s)
      </div>

      {filteredDocs.length === 0 ? (
        <Card className="glass-card border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <File className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">
              No documents found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocs.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors shadow-sm h-full flex flex-col group">
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-secondary/50 rounded-xl group-hover:bg-primary/10 transition-colors">
                      {getIcon(doc.type)}
                    </div>
                    <Badge variant="outline" className="text-xs bg-background">
                      {doc.category}
                    </Badge>
                  </div>
                  <h3
                    className="font-bold text-sm mb-1 line-clamp-2"
                    title={doc.name}
                  >
                    {doc.name}
                  </h3>
                  <div className="text-xs text-muted-foreground mb-4 flex-1">
                    {doc.size} • {new Date(doc.date).toLocaleDateString()}
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleDownload(doc.name)}
                  >
                    <Download className="w-4 h-4" /> Download
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    {getIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{doc.name}</h3>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                      <span>{doc.size}</span>
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 h-4 leading-none"
                      >
                        {doc.category}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc.name)}
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      <div className="mt-8 pt-8 border-t border-border/50">
        <h3 className="text-lg font-bold font-display mb-4">
          Upload Assignment
        </h3>
        <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground mt-1">
            PDF, DOCX or ZIP (max. 10MB)
          </p>
          <Button variant="outline" className="mt-4">
            Select Files
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
