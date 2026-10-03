import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">
          {title}
        </h1>

        <p className="text-muted-foreground mt-1">
          {description}
        </p>
      </div>

      <Card className="glass-card border-border/50 shadow-sm border-dashed">
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">

          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-2">
            {title.charAt(0)}
          </div>

          <h2 className="text-xl font-bold font-display">
            Under Construction
          </h2>

          <p className="text-muted-foreground max-w-sm">
            This module is currently being finalized. Full functionality will
            be available in the next release.
          </p>

          <Button variant="outline" className="mt-4">
            Go Back
          </Button>

        </CardContent>
      </Card>

    </div>
  );
}