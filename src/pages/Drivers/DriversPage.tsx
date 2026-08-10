import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Skeleton,
  TableCell,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import { dashboardService } from "../../services/dashboardService";
type DriverForm = {
  fullName: string;
  phone: string;
  password: string;
  ambulanceType: string;
  cnic: string;
  licenseNumber: string;
  vehicleNumber: string;
  model: string;
  profileImage?: File | null;
};

const initialForm: DriverForm = {
  fullName: "",
  phone: "",
  password: "",
  ambulanceType: "",
  cnic: "",
  licenseNumber: "",
  vehicleNumber: "",
  model: "",
};
export default function DriversPage() {
  const navigate = useNavigate();

  //data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  //filters
  const [status, setStatus] = useState("");
  const [online, setOnline] = useState("");
  const [availability, setAvailability] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  //create driver
  const [openCreate, setOpenCreate] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DriverForm | "profileImage", string>>
  >({});

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    loadDrivers();
  }, [
    page,
    rowsPerPage,
    debouncedSearch,
    status,
    online,
    availability,
    ambulanceType,
  ]);

  const openCreateDriver = () => {
    setForm(initialForm);
    setPreview("");
    setImage(null);
    setOpenCreate(true);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

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

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.ambulanceType) {
      newErrors.ambulanceType = "Select ambulance type";
    }

    if (!form.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    } else if (!/^\d{5}-\d{7}-\d{1}$/.test(form.cnic.trim())) {
      newErrors.cnic = "CNIC must be XXXXX-XXXXXXX-X";
    }

    if (!form.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!form.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (!form.model.trim()) {
      newErrors.model = "Vehicle model is required";
    }

    if (!image) {
      newErrors.profileImage = "Profile image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("phone", form.phone);
      formData.append("cnic", form.cnic);
      formData.append("licenseNumber", form.licenseNumber);
      formData.append("ambulanceType", form.ambulanceType);
      formData.append("vehicleNumber", form.vehicleNumber);
      formData.append("model", form.model);
      formData.append("password", form.password);

      // Image optional during edit
      if (image) {
        formData.append("profileImage", image);
      }

      await dashboardService.createDriver(formData);

      setOpenCreate(false);
      await loadDrivers();
    } catch (error: any) {
      setError(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const loadDrivers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getDrivers({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
        status,
        isOnline: online,
        isAvailable: availability,
        ambulanceType,
      });

      console.log(data, "data");
      setRows(data?.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Drivers"
        action={
          <Button variant="contained" onClick={openCreateDriver}>
            {"Create Driver"}
          </Button>
        }
      />
      <div style={{ marginBottom: 20 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <SearchBar
            value={search}
            onChange={(e) => {
              setSearch(e);
              setPage(0);
            }}
            placeholder="Search driver name or phone..."
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </TextField>

          <TextField
            select
            label="Online"
            value={online}
            onChange={(e) => {
              setOnline(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Online</MenuItem>
            <MenuItem value="false">Offline</MenuItem>
          </TextField>

          <TextField
            select
            label="Availability"
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Busy</MenuItem>
          </TextField>

          <TextField
            select
            label="Ambulance Type"
            value={ambulanceType}
            onChange={(e) => {
              setAmbulanceType(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="NORMAL">Normal</MenuItem>
            <MenuItem value="VENTILATOR">Ventilator</MenuItem>
            <MenuItem value="DEAD_BODY">Dead Body</MenuItem>
          </TextField>
        </Box>
      </div>

      {loading ? (
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No drivers found"
          description="Try a different search term."
        />
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <DataTable
            columns={[
              { key: "photo", label: "Photo" },
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              { key: "Ambulance Type", label: "Ambulance Type" },
              { key: "status", label: "Status" },
              { key: "online", label: "Online" },
              { key: "trips", label: "Completed Trips" },
              { key: "action", label: "Action" },
            ]}
            rows={rows}
            renderRow={(row) => (
              <>
                <TableCell>
                  <Avatar src={row?.profileImage} alt={row?.fullName} />
                </TableCell>
                <TableCell>{row?.fullName}</TableCell>
                <TableCell>{row?.phone}</TableCell>
                <TableCell>{row?.vehicleType}</TableCell>

                <TableCell>
                  <Chip
                    label={row.status}
                    color={
                      row.status === "APPROVED"
                        ? "success"
                        : row.status === "PENDING"
                          ? "warning"
                          : "error"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.isOnline ? "" : ""}
                    color={row.isOnline ? "success" : "default"}
                    size="small"
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 100,
                    }}
                  />
                </TableCell>

                <TableCell>{row.totalCompletedTrips}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() =>
                      navigate(`/dashboard/drivers/${row._id ?? row.id}`)
                    }
                  >
                    View/Edit
                  </Button>
                </TableCell>
              </>
            )}
          />
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      )}

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{"Create Driver"}</DialogTitle>

        <DialogContent>
          {/* Profile Image */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              src={preview || undefined}
              sx={{
                width: 90,
                height: 90,
                mb: 1,
              }}
            />

            <Button variant="outlined" component="label">
              Upload Profile Image
              <input
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />
            </Button>

            <Typography
              variant="caption"
              color={errors.profileImage ? "error" : "text.secondary"}
              sx={{ mt: 1 }}
            >
              {errors.profileImage || "JPG, PNG or WEBP"}
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{
              display: "grid",
              gap: 2,
              mt: 1,
            }}
          >
            {/* Full Name */}
            <TextField
              label="Full Name"
              fullWidth
              value={form.fullName}
              onChange={(e) => {
                setForm({
                  ...form,
                  fullName: e.target.value,
                });

                setErrors({
                  ...errors,
                  fullName: "",
                });
              }}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />

            {/* Phone */}
            <TextField
              label="Phone"
              placeholder="+923001234567"
              fullWidth
              value={form.phone}
              onChange={(e) => {
                setForm({
                  ...form,
                  phone: e.target.value,
                });

                setErrors({
                  ...errors,
                  phone: "",
                });
              }}
              error={!!errors.phone}
              helperText={errors.phone}
            />

            {/* Password */}

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => {
                setForm({
                  ...form,
                  password: e.target.value,
                });

                setErrors({
                  ...errors,
                  password: "",
                });
              }}
              error={!!errors.password}
              helperText={errors.password}
            />

            {/* Ambulance Type */}
            <TextField
              select
              label="Ambulance Type"
              value={form.ambulanceType}
              onChange={(e) => {
                setForm({
                  ...form,
                  ambulanceType: e.target.value,
                });

                setErrors({
                  ...errors,
                  ambulanceType: "",
                });
              }}
              error={!!errors.ambulanceType}
              helperText={errors.ambulanceType}
              fullWidth
            >
              <MenuItem value="">Select ambulance type</MenuItem>

              <MenuItem value="NORMAL">Normal</MenuItem>

              <MenuItem value="VENTILATOR">Ventilator</MenuItem>

              <MenuItem value="DEAD_BODY">Dead Body</MenuItem>
            </TextField>

            {/* CNIC */}
            <TextField
              label="CNIC"
              placeholder="42101-1234567-1"
              fullWidth
              value={form.cnic}
              onChange={(e) => {
                setForm({
                  ...form,
                  cnic: e.target.value,
                });

                setErrors({
                  ...errors,
                  cnic: "",
                });
              }}
              error={!!errors.cnic}
              helperText={errors.cnic}
            />

            {/* License */}
            <TextField
              label="License Number"
              fullWidth
              value={form.licenseNumber}
              onChange={(e) => {
                setForm({
                  ...form,
                  licenseNumber: e.target.value,
                });

                setErrors({
                  ...errors,
                  licenseNumber: "",
                });
              }}
              error={!!errors.licenseNumber}
              helperText={errors.licenseNumber}
            />

            {/* Vehicle Number */}
            <TextField
              label="Vehicle Number"
              fullWidth
              value={form.vehicleNumber}
              onChange={(e) => {
                setForm({
                  ...form,
                  vehicleNumber: e.target.value,
                });

                setErrors({
                  ...errors,
                  vehicleNumber: "",
                });
              }}
              error={!!errors.vehicleNumber}
              helperText={errors.vehicleNumber}
            />

            {/* Vehicle Model */}
            <TextField
              label="Vehicle Model"
              fullWidth
              value={form.model}
              onChange={(e) => {
                setForm({
                  ...form,
                  model: e.target.value,
                });

                setErrors({
                  ...errors,
                  model: "",
                });
              }}
              error={!!errors.model}
              helperText={errors.model}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenCreate(false);
              setErrors({});
            }}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Driver"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
