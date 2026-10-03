import { startTransition, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Shell } from "@/components/ui/admin-components";
import { StatCards } from "@/components/ui/admin-components";
import { StatusBadge } from "@/components/ui/admin-components";
import adminService from "@/lib/services/admin.service";

export default function TicketsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [priority, setPriority] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let isLive = true;

    const loadTickets = async () => {
      try {
        const response = await adminService.listTickets();

        if (!isLive) return;

        startTransition(() => {
          setTickets(response || []);
        });
      } catch (error) {
        console.error("Error fetching tickets:", error);
        if (isLive) {
          toast({ title: "Unable to load tickets", variant: "destructive" });
        }
      }
    };

    void loadTickets();

    return () => {
      isLive = false;
    };
  }, [toast]);

  const visible = tickets.filter(
    (t) =>
      (filter === "All" || t.status === filter) &&
      (priority === "All" || t.priority === priority),
  );

  return (
    <Shell kind="tickets">
      <StatCards
        items={[
          {
            label: "Total Tickets",
            value: `${tickets.length}`,
            icon: Activity,
          },
          {
            label: "Open",
            value: `${tickets.filter((t) => t.status === "Open").length}`,
            icon: AlertTriangle,
          },
          {
            label: "In Progress",
            value: `${tickets.filter((t) => t.status === "In Progress").length}`,
            icon: CircleDot,
          },
          {
            label: "Resolved",
            value: `${tickets.filter((t) => t.status === "Resolved").length}`,
            icon: CheckCircle2,
          },
        ]}
      />
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          className="overflow-x-auto"
        >
          <TabsList>
            {["All", "Open", "In Progress", "Resolved", "Closed"].map((v) => (
              <TabsTrigger key={v} value={v}>
                {v}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "High", "Medium", "Low"].map((v) => (
              <SelectItem key={v} value={v}>
                {v === "All" ? "All priorities" : v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="glass-card border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "ID",
                  "Subject",
                  "Student",
                  "Category",
                  "Priority",
                  "Status",
                  "Date",
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
              {visible.map((ticket) => (
                <tr
                  className="border-t border-border/50 hover:bg-muted/30 cursor-pointer"
                  key={ticket.id}
                  onClick={() => setSelected(ticket)}
                >
                  <td className="px-5 py-3 font-mono text-xs">{ticket.id}</td>
                  <td className="px-5 py-3 font-medium max-w-[260px] truncate">
                    {ticket.subject}
                  </td>
                  <td className="px-5 py-3">{ticket.student}</td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary">{ticket.category}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge value={ticket.priority} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge value={ticket.status} />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {ticket.date.slice(0, 10)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {selected && (
        <Card className="glass-card border-primary/30 shadow-lg">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                <StatusBadge value={selected.priority} />
                <StatusBadge value={selected.status} />
              </div>
              <CardTitle className="text-lg">{selected.subject}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selected.id} · {selected.student}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelected(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              User reported issues connecting to the campus network from their
              dormitory. The problem started after the recent firmware update.
            </p>
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <p className="font-medium">Ticket opened</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selected.date}
              </p>
              <p className="font-medium mt-3">Assigned to support team</p>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting response
              </p>
            </div>
            <Textarea placeholder="Write a reply to the student..." />
            <div className="flex justify-end">
              <Button onClick={() => toast({ title: "Reply sent" })}>
                Send reply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Shell>
  );
}
