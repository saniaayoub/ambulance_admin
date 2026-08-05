import { useEffect, useState } from "react";
import { Button, Skeleton, TextField } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  dashboardService,
  type SettingsData,
} from "../../services/dashboardService";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getSettings();
        setSettings(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setError(null);

    try {
      await dashboardService.updateSettings(settings);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure company contact information"
      />

      {loading ? (
        <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 3 }} />
      ) : !settings ? (
        <EmptyState
          title="No settings available"
          description="The settings data has not been loaded yet."
        />
      ) : (
        <div style={{ display: "grid", gap: 16, maxWidth: 620 }}>
          <TextField
            label="Company Name"
            value={settings.companyName}
            onChange={(event) =>
              setSettings({ ...settings, companyName: event.target.value })
            }
          />
          <TextField
            label="Support Phone"
            value={settings.supportPhone}
            onChange={(event) =>
              setSettings({ ...settings, supportPhone: event.target.value })
            }
          />
          <TextField
            label="Emergency Phone"
            value={settings.emergencyPhone}
            onChange={(event) =>
              setSettings({ ...settings, emergencyPhone: event.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
