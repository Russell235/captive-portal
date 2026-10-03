import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shell } from "@/components/ui/admin-components";
import { SettingField, SettingToggle } from "@/components/ui/admin-components";
import adminService from "@/lib/services/admin.service";
import { useEffect } from "react";
import { UploadBox } from "@/components/ui/admin-components";

export default function SettingsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("General");
  const save = () =>
    toast({
      title: `${tab} settings saved`,
      description: "Your system configuration has been updated.",
    });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const settings = await adminService.getSettings();
        if (!mounted || !settings) return;
        // For now we don't map settings into local fields, but this
        // ensures the settings endpoint is reachable.
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    void load();
    return () => (mounted = false);
  }, []);
  return (
    <Shell kind="settings">
      <div className="flex flex-wrap gap-2">
        {["General", "Network", "Security", "Branding"].map((v) => (
          <Button
            key={v}
            size="sm"
            variant={tab === v ? "default" : "outline"}
            onClick={() => setTab(v)}
          >
            {v}
          </Button>
        ))}
      </div>
      <Card className="glass-card border-border/50 max-w-3xl">
        <CardHeader>
          <CardTitle>{tab} configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {tab === "General" && (
            <>
              <SettingField
                label="Institution name"
                value="Prestige University"
              />
              <SettingField label="Portal name" value="CampusNet" />
              <SettingField
                label="Support email"
                value="support@university.edu"
              />
              <SettingField label="Timezone" value="UTC+1 · Africa/Douala" />
            </>
          )}
          {tab === "Network" && (
            <>
              <SettingField
                label="Max bandwidth per student"
                value="50 GB / month"
              />
              <SettingField label="Session timeout" value="8 hours" />
              <SettingToggle
                label="Guest Wi-Fi"
                description="Allow visitors to join a restricted network."
              />
              <SettingToggle
                label="VPN access"
                description="Enable secure off-campus access to resources."
              />
            </>
          )}
          {tab === "Security" && (
            <>
              <SettingToggle
                label="Two-factor authentication"
                description="Require a second factor for administrator accounts."
              />
              <SettingField label="Login attempt limit" value="5 attempts" />
              <SettingField label="Block duration" value="30 minutes" />
              <div className="space-y-2">
                <Label>IP whitelist</Label>
                <Textarea placeholder="Enter one IP address per line" />
              </div>
            </>
          )}
          {tab === "Branding" && (
            <>
              <SettingField
                label="Portal tagline"
                value="Your university life, beautifully connected."
              />
              <div className="flex items-center gap-4">
                <div>
                  <Label>Primary color</Label>
                  <Input
                    type="color"
                    defaultValue="#4f46e5"
                    className="w-20 p-1 mt-2"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for buttons, active navigation, and portal highlights.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UploadBox label="Upload logo" />
                <UploadBox label="Upload favicon" />
              </div>
            </>
          )}
          <div className="flex justify-end pt-2">
            <Button onClick={save}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}
