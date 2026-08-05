import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Stack,
  TableCell,
  Typography,
} from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  dashboardService,
  type DashboardStats,
  type RecentBooking,
} from "../../services/dashboardService";
import dayjs from "dayjs";
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTrips, setRecentTrips] = useState<RecentBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<RecentBooking | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dashboardData] = await Promise.all([
          dashboardService.getDashboard(),
          // dashboardService.getRecentTrips(),
        ]);
        console.log(dashboardData, "dashboardData");
        setStats(dashboardData?.stats);
        setRecentTrips(dashboardData?.recentTrips || []);

        // setRecentTrips(tripsData);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);
  console.log(recentTrips, "");
  const filteredTrips = useMemo(() => {
    return recentTrips.filter((item) =>
      `${item?.userId?.fullName ?? ""} ${item?.driverId?.userId?.fullName ?? ""} ${item?.status ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [recentTrips, search]);

  const selectedBookingId = selectedBooking?._id ?? selectedBooking?.id;

  const getStatusColor = (status?: string) => {
    const normalized = (status ?? "").toLowerCase();

    if (normalized.includes("completed")) {
      return "success";
    }

    if (normalized.includes("cancel")) {
      return "error";
    }

    if (
      normalized.includes("started") ||
      normalized.includes("assigned") ||
      normalized.includes("waiting")
    ) {
      return "info";
    }

    return "default";
  };

  const statItems = [
    { title: "Today's Trips", value: stats?.todayTrips ?? 0 },
    { title: "Active Trips", value: stats?.activeTrips ?? 0 },
    { title: "Completed Trips", value: stats?.completedTrips ?? 0 },
    { title: "Available Ambulances", value: stats?.availableAmbulances ?? 0 },
    { title: "Busy Ambulances", value: stats?.busyAmbulances ?? 0 },
    { title: "Online Drivers", value: stats?.onlineDrivers ?? 0 },
  ];

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Operations overview for the day"
        action={
          <Button variant="contained" color="primary">
            Export
          </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search recent trips"
      />

      {loading ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {statItems.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard title={item.title} value={item.value} />
            </Grid>
          ))}
        </Grid>
      )}

      <div style={{ marginTop: 24 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Recent Trips
        </Typography>

        {loading ? (
          <Skeleton
            variant="rectangular"
            height={240}
            sx={{ borderRadius: 3 }}
          />
        ) : filteredTrips.length === 0 ? (
          <EmptyState
            title="No recent trips"
            description="Try a different search term."
          />
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "Trip ID" },
              { key: "user", label: "User" },
              { key: "driver", label: "Driver" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
              { key: "action", label: "Action" },
            ]}
            rows={filteredTrips}
            renderRow={(row) => (
              <>
                <TableCell>{row?._id?.slice(-6)}</TableCell>
                <TableCell>{row?.userId?.fullName}</TableCell>
                <TableCell>{row?.driverId?.userId?.fullName}</TableCell>
                <TableCell>
                  <Chip
                    label={row?.status || "Unknown"}
                    color={getStatusColor(row?.status)}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  {dayjs(row?.createdAt).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => setSelectedBooking(row)}
                  >
                    View
                  </Button>
                </TableCell>
              </>
            )}
          />
        )}
      </div>

      <Dialog
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Trip Details</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Trip Information
              </Typography>
              <Typography>Trip ID: {selectedBookingId || "---"}</Typography>
              <Typography>
                Trip Date:{" "}
                {dayjs(selectedBooking?.createdAt).format(
                  "DD MMM YYYY, h:mm A",
                )}
              </Typography>
              <Typography>
                Status: {selectedBooking?.status || "---"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                User
              </Typography>
              <Typography>
                Name: {selectedBooking?.userId?.fullName || "---"}
              </Typography>
              <Typography>
                Phone: {selectedBooking?.userId?.phone || "---"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Driver
              </Typography>
              <Typography>
                Name:{" "}
                {selectedBooking?.driverId?.userId?.fullName ||
                  selectedBooking?.driverId?.fullName ||
                  "---"}
              </Typography>
              <Typography>
                Phone:{" "}
                {selectedBooking?.driverId?.userId?.phone ||
                  selectedBooking?.driverId?.phone ||
                  "---"}
              </Typography>
              <Typography>
                Ambulance: {selectedBooking?.ambulanceType || "---"}{" "}
                {selectedBooking?.vehicleId?.vehicleNumber || "---"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Trip
              </Typography>
              <Typography>
                Pickup Address:{" "}
                {selectedBooking?.pickupLocation?.address || "---"}
              </Typography>
              <Typography>
                Destination Address:{" "}
                {selectedBooking?.destination?.address || "---"}
              </Typography>
              <Typography>
                Distance: {selectedBooking?.distanceKm || "---"} km
              </Typography>
              <Typography>
                Fare: {selectedBooking?.fare?.total || "---"}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBooking(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
