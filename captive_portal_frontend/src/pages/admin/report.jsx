import { useState, useEffect } from "react";
import {
  Activity,
  BarChart3,
  Download,
  FileText,
  Network,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartData } from "@/lib/mock-data";
import adminService from "@/lib/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/ui/admin-components";
import { StatCards } from "@/components/ui/admin-components";

export default function ReportsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState("7 Days");
  const [overview, setOverview] = useState(null);
  const [sessionsReport, setSessionsReport] = useState(null);
  const [studentsReport, setStudentsReport] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const ov = await adminService.getOverviewReport();
        const sr = await adminService.getSessionsReport();
        const st = await adminService.getStudentsReport();
        if (!mounted) return;
        setOverview(ov || null);
        setSessionsReport(sr || null);
        setStudentsReport(st || null);
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };
    void load();
    return () => (mounted = false);
  }, []);
  return (
    <Shell
      kind="reports"
      action={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toast({ title: "Report exported as PDF" })}
          >
            <Download className="w-4 h-4 mr-2" />
            Export report
          </Button>
        </div>
      }
    >
      <div className="flex gap-2">
        {["7 Days", "30 Days", "90 Days"].map((v) => (
          <Button
            key={v}
            size="sm"
            variant={range === v ? "default" : "outline"}
            onClick={() => setRange(v)}
          >
            {v}
          </Button>
        ))}
      </div>
      <StatCards
        items={[
          {
            label: "Peak Hour",
            value: overview?.peakHour ?? "8:00 PM",
            helper: "Highest bandwidth demand",
            icon: Activity,
          },
          {
            label: "Most Active Day",
            value: overview?.mostActiveDay ?? "Wednesday",
            helper: `${overview?.mostActiveCount ?? "5,980"} connections`,
            icon: BarChart3,
          },
          {
            label: "Total Data",
            value: overview?.totalData ?? "4.2 TB",
            helper: `Last ${range.toLowerCase()}`,
            icon: Network,
          },
          {
            label: "Avg Sessions",
            value: overview?.avgSessions ?? "4,280",
            helper: "Concurrent connections",
            icon: Users,
          },
        ]}
      />
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Bandwidth usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.bandwidth}>
                <defs>
                  <linearGradient
                    id="reportBandwidth"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.15}
                />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#4f46e5"
                  fill="url(#reportBandwidth)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Weekly active users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.weeklyUsers}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.15}
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="students"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="staff" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Device mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.devices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={92}
                    innerRadius={55}
                  >
                    {chartData.devices.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Recent reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Weekly Network Summary",
            "Student Access Report",
            "Device Health Audit",
          ].map((name, i) => (
            <div
              className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 p-3"
              key={name}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    PDF · May {15 - i}, 2024 · {i + 1}.2 MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: "Download started" })}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </Shell>
  );
}
