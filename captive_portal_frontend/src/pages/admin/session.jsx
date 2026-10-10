import { Activity, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Shell } from "@/components/ui/admin-components";
import { StatCards } from "@/components/ui/admin-components";
import { Toolbar } from "@/components/ui/admin-components";
import { SearchBox} from "@/components/ui/admin-components";
import { CircleDot } from "lucide-react";
import adminService from "@/lib/services/admin.service";

export default function SessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    async function fetchSessions() {
      try {
        const result = await adminService.listSessions()
        setSessions(result);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast({ title: "Unable to load sessions", variant: "destructive" });
      }
    }

    fetchSessions();
  },[]);
  
  const filtered = sessions.filter(
    (s) =>
      (location === "All" || s.location === location) &&
      `${s.student_name} ${s.ip_address}`.toLowerCase().includes(search.toLowerCase()),
  );

  const averageDuration = (() => {
    if (!sessions.length) return "—";

    let validCount = 0;
    const totalMs = sessions.reduce((sum, s) => {
      const start = new Date(s.started_at).getTime();
      const end = s.ended_at ? new Date(s.ended_at).getTime() : now;
      if (Number.isNaN(start) || Number.isNaN(end)) return sum;
      validCount++;
      return sum + Math.max(0, end - start);
    }, 0);

    if (!validCount) return "—";

    const avgMs = totalMs / validCount;
    const totalMinutes = Math.floor(avgMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  })();

    const terminate = async (id) => {
    try {
      await adminService.terminateSession(id);
      // Recharger les sessions
      const result = await adminService.listSessions();
      setSessions(result);
      toast({
        title: "Session terminated",
        description: "The student connection has been safely closed.",
      });
    } catch (error) {
      console.error("Error terminating session:", error);
      toast({
        title: "Error",
        description: "Unable to terminate the session.",
        variant: "destructive",
      });
    }
  };
  return (
    <Shell
      kind="sessions"
      action={
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-sm border border-emerald-500/20 w-fit">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      }
    >
      <StatCards
        items={[
          {
            label: "Active Sessions",
            value: `${sessions.length}`,
            helper: "Across campus",
            icon: Wifi,
          },
          {
            label: "Bandwidth Today",
            value: "24.8 GB",
            helper: "+8.4% from yesterday",
            icon: Activity,
          },
          {
            label: "Average Duration",
            value: averageDuration,
            helper: "Across active users",
            icon: CircleDot,
          },
        ]}
      />
      <Toolbar>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search student or IP address"
        />
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full sm:w-56 bg-background/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All locations</SelectItem>
            {Array.from(new Set(sessions.map((s) => s.location))).map((v) => (
              <SelectItem key={v} value={v}>
                {v}
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
                  "IP address",
                  "MAC address",
                  // "Location",
                  // "Duration",
                  // "Bandwidth",
                  "Device",
                  "",
                ].map((h) => (
                  <th className="text-left font-medium px-5 py-3" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border/50 hover:bg-muted/30"
                >
                  <td className="px-5 py-3 font-medium">{s.student_name}</td>
                  <td className="px-5 py-3 font-mono text-xs">{s.ip_address}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {s.mac_address}
                  </td>
                  {/* <td className="px-5 py-3">{s.location}</td>
                  <td className="px-5 py-3">{s.duration}</td>
                  <td className="px-5 py-3">{s.bandwidth}</td> */}
                  <td className="px-5 py-3">{s.device_id}</td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => terminate(s.id)}
                    >
                      Terminate
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
