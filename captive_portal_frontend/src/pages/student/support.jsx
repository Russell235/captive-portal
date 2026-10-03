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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import studentService from "@/lib/services/student.service";
import { tickets as mockTickets } from "@/lib/mock-data";
import { MessageSquarePlus, LifeBuoy, CheckCircle2, Clock } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

// Hook local temporaire
const useToast = () => ({
  toast: ({ title, description }) => {
    alert(`${title}\n${description || ""}`);
  },
});

export default function StudentSupport() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const t = await studentService.listMyTickets();
        if (!mounted) return;
        setTickets(() => (t && t.length ? t : mockTickets));
      } catch (err) {
        console.error(err);
        setTickets(() => mockTickets);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !category || !priority || !description) {
      toast({ title: "Error", description: "Please fill in all fields" });
      return;
    }
    (async () => {
      try {
        const payload = { subject, description, category, priority };
        const created = await studentService.createTicket(payload);
        setTickets([created, ...tickets]);
        setSubject("");
        setCategory("");
        setPriority("");
        setDescription("");
        toast({
          title: "Ticket Submitted",
          description:
            "Support team has been notified. Ticket ID: " + created.id,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || JSON.stringify(err),
        });
      }
    })();
  };

  const filteredTickets = tickets.filter(
    (t) => activeFilter === "All" || t.status === activeFilter.toLowerCase(),
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            {status}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">
            {status}
          </Badge>
        );
      case "Closed":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-background">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "High":
        return (
          <Badge
            variant="destructive"
            className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]"
          >
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px]"
          >
            Med
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            Low
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] rounded-xl" />
          <Skeleton className="h-[500px] rounded-xl lg:col-span-2" />
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
          Support Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Get help with network, hardware, and account issues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* New Ticket Form */}
        <Card className="glass-card border-border/50 shadow-sm order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <MessageSquarePlus className="w-5 h-5 text-primary" /> Open New
              Ticket
            </CardTitle>
            <CardDescription>Submit a request to IT support.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief summary of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Network">Network/Wi-Fi</SelectItem>
                    <SelectItem value="Account">Account Access</SelectItem>
                    <SelectItem value="Resources">
                      Academic Resources
                    </SelectItem>
                    <SelectItem value="Hardware">Hardware/Printers</SelectItem>
                    <SelectItem value="Software">Software/Portal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - General inquiry</SelectItem>
                    <SelectItem value="Medium">
                      Medium - Partial disruption
                    </SelectItem>
                    <SelectItem value="High">High - Total blockage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  placeholder="Provide details about your issue, error messages, and location..."
                  className="min-h-[120px] bg-background resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full gap-2 mt-2">
                <LifeBuoy className="w-4 h-4" /> Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Tickets */}
        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-xl font-bold font-display">My Tickets</h2>
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="bg-muted">
                {["All", "Open", "In Progress", "Resolved"].map((f) => (
                  <TabsTrigger key={f} value={f} className="text-xs">
                    {f}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <Card className="glass-card border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                  <CheckCircle2 className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No tickets found</p>
                </CardContent>
              </Card>
            ) : (
              filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="glass-card border-border/50 hover:border-primary/20 transition-colors shadow-sm group cursor-pointer"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium bg-secondary/80 px-2 py-0.5 rounded text-secondary-foreground">
                            {ticket.id}
                          </span>
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                          {ticket.subject}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5"
                            >
                              {ticket.category}
                            </Badge>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {ticket.created_at}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center sm:items-start">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
