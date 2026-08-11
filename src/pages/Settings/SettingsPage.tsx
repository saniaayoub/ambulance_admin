import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import PageHeader from "../../components/common/PageHeader";

import {
  dashboardService,
  type Settings,
} from "../../services/dashboardService";

export default function SettingsPage() {
  const [form, setForm] = useState<Settings | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const data = await dashboardService.getSettings();

      setForm(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Settings, value: any) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev,
    );
  };

  const handleNotificationChange = (
    field: "bookingCreated" | "driverAssigned" | "tripCompleted",
    value: boolean,
  ) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            notifications: {
              ...prev.notifications,
              [field]: value,
            },
          }
        : prev,
    );
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      setSaving(true);
      setMessage("");

      await dashboardService.updateSettings({
        waitingFreeMinutes: form.waitingFreeMinutes,

        driverSearchRadiusKm: form.driverSearchRadiusKm,

        notifications: form.notifications,

        appName: form.appName,

        supportPhone: form.supportPhone,

        supportEmail: form.supportEmail,
      });

      setMessage("Settings updated successfully");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <Box p={3}>Loading settings...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Settings"
        description="Manage your ambulance system configuration"
      />

      {message && (
        <Alert
          severity={message.includes("successfully") ? "success" : "error"}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Booking Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Booking Settings
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure driver search and waiting time.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Free Waiting Time"
                  type="number"
                  fullWidth
                  value={form.waitingFreeMinutes}
                  onChange={(e) =>
                    handleChange("waitingFreeMinutes", Number(e.target.value))
                  }
                  helperText="Minutes before waiting charges start"
                />

                <TextField
                  label="Driver Search Radius"
                  type="number"
                  fullWidth
                  value={form.driverSearchRadiusKm}
                  onChange={(e) =>
                    handleChange("driverSearchRadiusKm", Number(e.target.value))
                  }
                  helperText="Maximum distance in kilometers"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                System Settings
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                General application information.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Application Name"
                  fullWidth
                  value={form.appName}
                  onChange={(e) => handleChange("appName", e.target.value)}
                />

                <TextField
                  label="Support Phone"
                  fullWidth
                  value={form.supportPhone}
                  onChange={(e) => handleChange("supportPhone", e.target.value)}
                />

                <TextField
                  label="Support Email"
                  fullWidth
                  value={form.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Notifications
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose which system events should generate notifications.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={form.notifications.bookingCreated}
                    onChange={(e) =>
                      handleNotificationChange(
                        "bookingCreated",
                        e.target.checked,
                      )
                    }
                  />
                }
                label="New booking created"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.notifications.driverAssigned}
                    onChange={(e) =>
                      handleNotificationChange(
                        "driverAssigned",
                        e.target.checked,
                      )
                    }
                  />
                }
                label="Driver assigned"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={form.notifications.tripCompleted}
                    onChange={(e) =>
                      handleNotificationChange(
                        "tripCompleted",
                        e.target.checked,
                      )
                    }
                  />
                }
                label="Trip completed"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Save */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
