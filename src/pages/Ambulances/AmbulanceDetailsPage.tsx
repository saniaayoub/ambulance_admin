import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { dashboardService } from "../../services/dashboardService";
import ErrorState from "../../components/common/ErrorState";

export default function AmbulanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ambulance, setAmbulance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    vehicleNumber: "",
    model: "",
    vehicleType: "",
    driverId: "",
  });

  const [drivers, setDrivers] = useState<any[]>([]);

  const loadAmbulance = async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getAmbulanceById(id!);

      const data = response?.data ?? response;

      setAmbulance(data);

      setForm({
        vehicleNumber: data?.vehicleNumber ?? "",
        model: data?.model ?? "",
        vehicleType: data?.vehicleType ?? "",
        driverId: data?.driver?._id ?? "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await dashboardService.getDrivers({
        page: 1,
        limit: 100,
      });
      console.log(response?.items, "kk");
      setDrivers(response?.items ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      loadAmbulance();
    }
  }, [id]);

  useEffect(() => {
    if (editing) {
      loadDrivers();
    }
  }, [editing]);

  const handleSave = async () => {
    try {
      setLoading(true);

      await dashboardService.updateAmbulance(id!, form);

      // success
      setSuccessMessage("Ambulance updated successfully");

      await loadAmbulance();
    } catch (error: any) {
      console.log("UPDATE AMBULANCE ERROR:", error?.response?.data);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update ambulance";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ambulance) {
    return <Typography>Ambulance not found</Typography>;
  }

  return (
    <Box>
      {/* Header */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        style={{ justifyContent: "space-between", alignItems: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Button
            onClick={() => navigate("/dashboard/ambulances")}
            sx={{ mb: 1 }}
          >
            ← Back to Ambulances
          </Button>

          <Typography variant="h4" fontWeight={700}>
            Ambulance Details
          </Typography>
        </Box>

        {!editing && (
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit Ambulance
          </Button>
        )}
      </Stack>

      {error && <ErrorState message={error} />}
      <Grid container spacing={3}>
        {/* Vehicle Information */}

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Vehicle Information
              </Typography>

              {editing ? (
                <Stack spacing={2}>
                  <TextField
                    label="Vehicle Number"
                    fullWidth
                    value={form.vehicleNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        vehicleNumber: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Model"
                    fullWidth
                    value={form.model}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        model: e.target.value,
                      })
                    }
                  />

                  <TextField
                    select
                    label="Ambulance Type"
                    fullWidth
                    value={form.vehicleType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        vehicleType: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="NORMAL">Normal</MenuItem>

                    <MenuItem value="VENTILATOR">Ventilator</MenuItem>

                    <MenuItem value="DEAD_BODY">Dead Body</MenuItem>
                  </TextField>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <InfoRow
                    label="Vehicle Number"
                    value={ambulance.vehicleNumber}
                  />

                  <InfoRow label="Model" value={ambulance.model} />

                  <InfoRow label="Type" value={ambulance.vehicleType} />

                  <InfoRow label="Status" value={ambulance.status} />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Driver */}

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Assigned Driver
              </Typography>

              {editing ? (
                <TextField
                  select
                  label="Driver"
                  fullWidth
                  value={form.driverId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      driverId: e.target.value,
                    })
                  }
                >
                  <MenuItem value="">Unassigned</MenuItem>

                  {drivers.map((driver) => {
                    return (
                      <MenuItem key={driver._id} value={driver._id}>
                        {driver.fullName}
                      </MenuItem>
                    );
                  })}
                </TextField>
              ) : Object.keys(ambulance.driver?.user).length > 0 ? (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={ambulance.driver?.user?.profileImage}
                      sx={{
                        width: 55,
                        height: 55,
                      }}
                    />

                    <Box>
                      <Typography fontWeight={600}>
                        {ambulance.driver?.user?.fullName}
                      </Typography>

                      <Typography color="text.secondary">
                        {ambulance.driver?.user?.phone}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`/dashboard/drivers/${ambulance.driver._id}`)
                    }
                  >
                    View Driver
                  </Button>
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  No driver assigned
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Status */}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Ambulance Status
              </Typography>

              <Chip
                label={ambulance.status}
                color={
                  ambulance.status === "AVAILABLE"
                    ? "success"
                    : ambulance.status === "BUSY"
                      ? "warning"
                      : "default"
                }
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                BUSY status is controlled by the trip system and should not
                normally be changed manually.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save / Cancel */}

      {editing && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Button onClick={() => setEditing(false)} disabled={saving}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      )}
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography fontWeight={500}>{value || "-"}</Typography>
    </Box>
  );
}
