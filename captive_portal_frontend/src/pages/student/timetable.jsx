import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { timetable as mockTimetable } from "@/lib/mock-data";
import studentService from "@/lib/services/student.service";
import { CalendarDays, List, MapPin, User, Clock } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function StudentTimetable() {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(mockTimetable);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await studentService.getMyTimetable();
        if (!mounted) return;
        // adapt backend shape to front-end mock shape if needed
        const mapped = data.map((r, idx) => ({
          id: r.id ?? idx,
          day: r.day,
          start: r.start_time || r.start,
          end: r.end_time || r.end,
          course: r.course_name || r.course || r.course_code,
          room: r.room,
          professor: r.professor,
          color: r.color || "bg-purple-500",
        }));
        setLoading(false);
        setTimetable(mapped);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-xl" />
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
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Timetable
          </h1>
          <p className="text-muted-foreground mt-1">
            This Week: May 13 - May 17, 2024
          </p>
        </div>
      </div>

      <Tabs defaultValue="week" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="week" className="gap-2">
              <CalendarDays className="w-4 h-4" /> Week View
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="w-4 h-4" /> List View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="week" className="mt-0">
          <Card className="glass-card border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-6 border-b border-border bg-secondary/30 text-sm font-medium">
                  <div className="p-4 text-center border-r border-border">
                    Time
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="p-4 text-center border-r border-border last:border-0"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div className="relative">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="grid grid-cols-6 border-b border-border/50 last:border-0"
                    >
                      <div className="p-3 text-center text-xs text-muted-foreground border-r border-border h-20">
                        {hour}
                      </div>
                      {days.map((day) => {
                        const cellClass = timetable.find(
                          (c) =>
                            c.day === day &&
                            c.start.startsWith(hour.split(":")[0]),
                        );
                        return (
                          <div
                            key={day}
                            className="border-r border-border last:border-0 relative p-1"
                          >
                            {cellClass && (
                              <div
                                className={`absolute inset-1 rounded-md p-2 text-white ${cellClass.color} shadow-sm z-10 flex flex-col justify-between overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer`}
                                style={{
                                  height:
                                    cellClass.start === cellClass.end
                                      ? "100%"
                                      : "calc(200% - 8px)",
                                }}
                              >
                                <p className="text-xs font-bold leading-tight line-clamp-2">
                                  {cellClass.course}
                                </p>
                                <div className="mt-1 space-y-0.5">
                                  <p className="text-[10px] opacity-90 flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3" />{" "}
                                    {cellClass.room}
                                  </p>
                                  <p className="text-[10px] opacity-90 flex items-center gap-1 truncate">
                                    <User className="w-3 h-3" />{" "}
                                    {cellClass.professor}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-0 space-y-6">
          {days.map((day) => {
            const dayClasses = timetable
              .filter((c) => c.day === day)
              .sort((a, b) => a.start.localeCompare(b.start));
            if (dayClasses.length === 0) return null;
            return (
              <div key={day} className="space-y-3">
                <h3 className="font-bold text-lg border-b border-border/50 pb-2">
                  {day}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayClasses.map((cls, idx) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="glass-card border-border/50 overflow-hidden shadow-sm relative group">
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${cls.color}`}
                        />
                        <CardContent className="p-4 pl-5">
                          <div className="flex justify-between items-start mb-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-secondary/50 font-medium"
                            >
                              <Clock className="w-3 h-3 mr-1" /> {cls.start} -{" "}
                              {cls.end}
                            </Badge>
                          </div>
                          <h4 className="font-bold mb-3">{cls.course}</h4>
                          <div className="space-y-1.5">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground/70" />{" "}
                              {cls.room}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground/70" />{" "}
                              {cls.professor}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
