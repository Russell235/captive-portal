import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Server, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/ui/admin-components";
import { StatCards } from "@/components/ui/admin-components";
import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/ui/admin-components";
import adminService from "@/lib/services/admin.service";

export default function DevicesPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("All");
  const [devices, setDevices] = useState([]);
  const filtered = devices.filter((d) => filter === "All" || d.type === filter);
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const result = await adminService.listDevices();
        console.log("Fetched devices:", result);
        setDevices(result || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  return (
    <Shell kind="devices">
      <StatCards
        items={[
          {
            label: "Total Devices",
            value: `${devices.length}`,
            icon: Server,
          },
          {
            label: "Online",
            value: `${devices.filter((d) => d.status === "Online").length}`,
            helper: "Healthy connections",
            icon: CheckCircle2,
          },
          {
            label: "Warning",
            value: `${devices.filter((d) => d.status === "Warning").length}`,
            helper: "Needs attention",
            icon: AlertTriangle,
          },
          {
            label: "Offline",
            value: `${devices.filter((d) => d.status === "Offline").length}`,
            helper: "Requires action",
            icon: XCircle,
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        {["All", "Router", "Switch", "Access Point"].map((v) => (
          <Button
            key={v}
            variant={filter === v ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(v)}
          >
            {v}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d, index) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-card border-border/50 shadow-sm hover:-translate-y-0.5 transition-transform">
              <CardHeader className="pb-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{d.device_name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {d.device_type}
                    </Badge>
                  </div>
                  <StatusBadge value={d.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${d.status === "Online" ? "bg-emerald-500 animate-pulse" : d.status === "Warning" ? "bg-amber-500" : "bg-rose-500"}`}
                  />
                  <span className="font-mono text-muted-foreground">
                    {d.ip_address}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {/* <div>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="font-medium mt-1">{d.uptime}</p>
                  </div> */}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Connected clients
                    </p>
                    <p className="font-medium mt-1">
                      {/* {d.clients.toLocaleString()} */}
                      {d.student_id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({ title: `Pinging ${d.name}...` })}
                  >
                    Ping
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({ title: `Restart initiated for ${d.name}` })
                    }
                  >
                    Restart
                  </Button>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}
