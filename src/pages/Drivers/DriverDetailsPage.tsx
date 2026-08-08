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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { dashboardService } from "../../services/dashboardService";

export default function DriverDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    cnic: "",
    licenseNumber: "",
    ambulanceType: "",
    vehicleNumber: "",
    model: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const loadDriver = async () => {
    try {
      setLoading(true);

      const response = await dashboardService.getDriverById(id!);

      const data = response?.data ?? response;
      console.log(data);
      setDriver(data);

      setForm({
        fullName: data?.fullName ?? "",
        phone: data?.phone ?? "",
        cnic: data?.cnic ?? "",
        licenseNumber: data?.licenseNumber ?? "",
        ambulanceType: data?.ambulanceType ?? "",
        vehicleNumber: data?.vehicleNumber ?? "",
        model: data?.model ?? "",
      });

      setPreview(data?.image ?? "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDriver();
    }
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const validateForm = () => {
    const newErrors: typeof errors = {};
    console.log(form, "form");
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }

    // if (!form.password) {
    //   newErrors.password = "Password is required";
    // } else if (form.password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters";
    // }

    if (!form.ambulanceType) {
      newErrors.ambulanceType = "Select ambulance type";
    }

    if (!form.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    }
    //  else if (!/^\d{5}-\d{7}-\d{1}$/.test(form.cnic.trim())) {
    //   newErrors.cnic = "CNIC must be XXXXX-XXXXXXX-X";
    // }

    if (!form.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!form.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (!form.model.trim()) {
      newErrors.model = "Vehicle model is required";
    }

    // if (!image) {
    //   newErrors.profileImage = "Profile image is required";
    // }
    // console.log(newErrors, "l");
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) {
        console.log(validateForm(), "val");
        return;
      }
      setSaving(true);

      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("phone", form.phone);
      formData.append("cnic", form.cnic);
      formData.append("licenseNumber", form.licenseNumber);
      formData.append("ambulanceType", form.ambulanceType);
      formData.append("vehicleNumber", form.vehicleNumber);
      formData.append("model", form.model);

      if (image) {
        formData.append("profileImage", image);
      }

      await dashboardService.updateDriver(id!, formData);

      setEditing(false);
      setImage(null);

      await loadDriver();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await dashboardService.updateDriverStatus(id!, status);

      await loadDriver();
    } catch (error) {
      console.error(error);
    }
  };

  const handleActiveChange = async (isActive: boolean) => {
    try {
      await dashboardService.updateDriverActive(id!, isActive);

      await loadDriver();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifycontent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!driver) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Driver not found</Typography>
      </Box>
    );
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
          <Button onClick={() => navigate("/dashboard/drivers")} sx={{ mb: 1 }}>
            ← Back to Drivers
          </Button>

          <Typography variant="h4" fontWeight={700}>
            Driver Details
          </Typography>
        </Box>

        {!editing && (
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit Driver
          </Button>
        )}
      </Stack>

      {/* Profile */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <Avatar
              src={preview}
              sx={{
                width: 110,
                height: 110,
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700}>
                {driver?.fullName}
              </Typography>

              <Typography color="text.secondary">{driver?.phone}</Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip
                  label={driver.status}
                  color={
                    driver.status === "APPROVED"
                      ? "success"
                      : driver.status === "REJECTED"
                        ? "error"
                        : "warning"
                  }
                />

                <Chip
                  label={driver.isActive ? "Active" : "Inactive"}
                  color={driver.isActive ? "success" : "default"}
                />

                <Chip
                  label={driver.isOnline ? "Online" : "Offline"}
                  color={driver.isOnline ? "success" : "default"}
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Driver Information */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Driver Information
              </Typography>

              {editing ? (
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fullName: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Phone"
                    fullWidth
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="CNIC"
                    fullWidth
                    value={form.cnic}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cnic: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="License Number"
                    fullWidth
                    value={form.licenseNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        licenseNumber: e.target.value,
                      })
                    }
                  />

                  <Button variant="outlined" component="label">
                    Change Profile Image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <InfoRow label="Full Name" value={driver?.fullName} />

                  <InfoRow label="Phone" value={driver?.phone} />

                  <InfoRow label="CNIC" value={driver.cnic} />

                  <InfoRow
                    label="License Number"
                    value={driver.licenseNumber}
                  />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Ambulance
              </Typography>

              {editing ? (
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Ambulance Type"
                    fullWidth
                    value={form.ambulanceType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ambulanceType: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="NORMAL">Normal</MenuItem>

                    <MenuItem value="VENTILATOR">Ventilator</MenuItem>

                    <MenuItem value="DEAD_BODY">Dead Body</MenuItem>
                  </TextField>

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
                    label="Vehicle Model"
                    fullWidth
                    value={form.model}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        model: e.target.value,
                      })
                    }
                  />
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <InfoRow label="Type" value={driver.ambulanceType} />

                  <InfoRow
                    label="Vehicle Number"
                    value={driver?.vehicleNumber}
                  />

                  <InfoRow label="Model" value={driver?.model} />

                  <InfoRow label="Vehicle Status" value={driver?.status} />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
        {editing && (
          <Stack
            direction="row"
            justifycontent="flex-end"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              onClick={() => {
                setEditing(false);
                setImage(null);
                setPreview(driver?.image ?? "");
              }}
            >
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        )}
        {/* Driver Statistics */}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Driver Statistics
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <InfoRow
                    label="Completed Trips"
                    value={driver.tripCount ?? 0}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <InfoRow label="Rating" value={driver.rating ?? 0} />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <InfoRow label="Reviews" value={driver.totalReviews ?? 0} />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <InfoRow
                    label="Availability"
                    value={driver.isAvailable ? "Available" : "Busy"}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Actions */}

      {/* Admin Actions */}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Admin Actions
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {driver.status !== "APPROVED" && (
              <Button
                color="success"
                variant="contained"
                onClick={() => handleStatusChange("APPROVED")}
              >
                Approve Driver
              </Button>
            )}

            {driver.status !== "REJECTED" && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => handleStatusChange("REJECTED")}
              >
                Reject Driver
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={() => handleActiveChange(!driver.isActive)}
            >
              {driver.isActive ? "Deactivate Driver" : "Activate Driver"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
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
