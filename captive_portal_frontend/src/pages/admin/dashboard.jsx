import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { chartData } from "@/lib/mock-data";
import { Users, Wifi, Server, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adminService from "@/lib/services/admin.service";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({})

  useEffect(() => {
    async function getOverview() {
      try {
        const result = await adminService.getOverviewReport();
        setOverview(result);
      } catch (error) {
        console.error("Error fetching overview:", error);
      } finally {
        setLoading(false);
      }
    }
    getOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time network and portal metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-background">Download Report</Button>
          <Button>System Actions</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{overview.totalStudents}</div>
            {/* <p className="text-xs text-emerald-500 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> 12% from yesterday</p> */}
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wifi className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concurrent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{overview.activeSessions}</div>
            {/* <p className="text-xs text-emerald-500 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> 5% peak increase</p> */}
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blocked Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{overview.blockedDevices}</div>
            {/* <p className="text-xs text-emerald-500 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> Operating normal</p> */}
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 shadow-sm relative overflow-hidden bg-primary/5 border-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-primary"><Server className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{overview.todayConnections}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Users Chart */}
        <Card className="lg:col-span-2 glass-card border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Weekly User Activity</CardTitle>
            <CardDescription>Unique authentications over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.weeklyUsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="students" name="Students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="staff" name="Staff & Faculty" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card className="glass-card border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Connected Devices</CardTitle>
            <CardDescription>Breakdown by device category</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-4">
              {chartData.devices.map((device, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                    <span className="text-muted-foreground">{device.name}</span>
                  </div>
                  <span className="font-medium">{device.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
