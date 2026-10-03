import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMeta } from "@/lib/mock-data";
import { tone } from "@/lib/mock-data";
import { CardContent, Card } from "./card";
import { Search, CircleDot
 } from "lucide-react";
 import { Input } from "./input";
 import { UploadCloud } from "lucide-react";
 import { Switch } from "@base-ui/react";


export function StatusBadge({ value }) {
  return (
    <Badge variant="outline" className={`capitalize ${tone(value)}`}>
      {value}
    </Badge>
  );
}

export function StatCards({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map(({ label, value, helper, icon: Icon }) => (
        <Card key={label} className="glass-card border-border/50 shadow-sm">
          <CardContent className="p-5 flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold font-display mt-2">{value}</p>{helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}</div>
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-4 h-4" /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export function PageHeader({ kind, action }) {
  const meta = pageMeta[kind];
  const Icon = meta.icon;
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="hidden sm:flex h-11 w-11 rounded-xl bg-primary/10 text-primary items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            {meta.title}
          </h1>
          <p className="text-muted-foreground mt-1">{meta.description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[420px] w-full rounded-xl" />
    </div>
  );
}

export function Shell({ kind, children, action }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, []);
  if (loading) return <LoadingState />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20 md:pb-0"
    >
      <PageHeader kind={kind} action={action} />
      {children}
    </motion.div>
  );
}

export function Toolbar({ children }) {
  return <Card className="glass-card border-border/50 shadow-sm"><CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">{children}</CardContent></Card>;
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9 bg-background/70" /></div>;
}

export function EmptyState({ title = "Nothing here yet", description = "Try adjusting your filters or create a new item." }) {
  return <Card className="glass-card border-border/50 border-dashed"><CardContent className="py-16 text-center"><CircleDot className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" /><p className="font-semibold">{title}</p><p className="text-sm text-muted-foreground mt-1">{description}</p></CardContent></Card>;
}
export function SettingField({ label, value }) {
  return <div className="space-y-2"><label>{label}</label><Input defaultValue={value} /></div>;
}
export function SettingToggle({ label, description }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-4"><div><p className="font-medium text-sm">{label}</p><p className="text-xs text-muted-foreground mt-1">{description}</p></div><Switch /></div>;
}
export function UploadBox({ label }) {
  return <div className="rounded-xl border border-dashed border-border p-6 text-center"><UploadCloud className="w-6 h-6 text-muted-foreground mx-auto" /><p className="text-sm font-medium mt-2">{label}</p><p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5 MB</p></div>;
}
