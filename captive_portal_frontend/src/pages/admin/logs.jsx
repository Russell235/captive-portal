import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Info,
  XCircle,
} from "lucide-react";
// import { formatDistanceToNow } from "date-fns";  
// import { activityLogs } from "@/lib/mock-data";  
import adminService from "@/lib/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shell } from "@/components/ui/admin-components";
import { Toolbar } from "@/components/ui/admin-components";
import { SearchBox } from "@/components/ui/admin-components";
import { StatusBadge } from "@/components/ui/admin-components";

export default function LogsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const iconFor = (value) =>
    value === "success" ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    ) : value === "warning" ? (
      <AlertTriangle className="w-5 h-5 text-amber-500" />
    ) : value === "error" ? (
      <XCircle className="w-5 h-5 text-rose-500" />
    ) : (
      <Info className="w-5 h-5 text-sky-500" />
    );
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const result = await adminService.listLogs();
        if (mounted && Array.isArray(result)) setLogs(result);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const visible = logs.filter(
    (log) =>
      (category === "All" || log.category === category) &&
      (status === "All" || log.status === status) &&
      `${log.action} ${log.user} ${log.ip}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Shell
      kind="logs"
      action={
        <Button
          variant="outline"
          onClick={() => toast({ title: "Logs exported" })}
        >
          <Download className="w-4 h-4 mr-2" />
          Export logs
        </Button>
      }
    >
      <Toolbar>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search action, user, or IP"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {[
              "auth",
              "security",
              "admin",
              "content",
              "network",
              "system",
              "support",
            ].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "success", "warning", "error", "info"].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>
      <div className="space-y-2">
        {visible.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="mt-0.5">{iconFor(log.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-medium">{log.action}</p>
                    <span className="text-xs text-muted-foreground">
                      {/* {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                      })} */}
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {log.user} · <span className="font-mono">{log.ip}</span>
                  </p>
                </div>
                {log.category && <StatusBadge value={log.category} />}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {visible.length} of {logs.length} logs
      </p>
    </Shell>
  );
}
