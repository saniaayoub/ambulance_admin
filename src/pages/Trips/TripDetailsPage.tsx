import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import { dashboardService, type Trip } from "../../services/dashboardService";
import dayjs from "dayjs";

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrip = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const result = await dashboardService.getTripById(id);
      setData(result);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load trip details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const handleAssignDriver = async () => {
    if (!id) return;

    try {
      const response = await dashboardService.assignDriverToTrip(id);
      setData((current) => ({ ...(current ?? {}), ...response }));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to assign driver.");
    }
  };

  const handleCancelTrip = async () => {
    if (!id) return;

    try {
      const response = await dashboardService.cancelTrip(id);
      setData((current) => ({ ...(current ?? {}), ...response }));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to cancel trip.");
    }
  };

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Trip Details
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {data?.status === "SEARCHING" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAssignDriver}
              >
                Assign Driver
              </Button>
            )}
            {(data?.status === "SEARCHING" || data?.status === "ASSIGNED") && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelTrip}
              >
                Cancel Trip
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <Skeleton
            variant="rectangular"
            height={320}
            sx={{ borderRadius: 3 }}
          />
        ) : data ? (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Booking Information
                  </Typography>
                  <Typography>
                    Booking ID: {data._id ?? data.id ?? "---"}
                  </Typography>
                  <Typography>
                    Booking Date:{" "}
                    {dayjs(data.createdAt).format("DD MMM YYYY, h:mm A")}
                  </Typography>
                  <Typography component="div">
                    Current Status:{" "}
                    <Chip label={data.status ?? "UNKNOWN"} size="small" />
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Patient
                  </Typography>
                  <Typography>
                    Name: {data.userId?.fullName ?? "---"}
                  </Typography>
                  <Typography>Phone: {data.userId?.phone ?? "---"}</Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Driver
                  </Typography>
                  <Typography>
                    Name:{" "}
                    {data.driverId?.userId?.fullName ??
                      data.driverId?.fullName ??
                      "---"}
                  </Typography>
                  <Typography>
                    Phone:{" "}
                    {data.driverId?.userId?.phone ??
                      data.driverId?.phone ??
                      "---"}
                  </Typography>
                  <Typography>
                    Ambulance: {data?.ambulanceType ?? "---"}{" "}
                    {data.vehicleId?.vehicleNumber ?? "---"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Trip
                  </Typography>
                  <Typography>
                    Pickup Address: {data.pickupLocation?.address ?? "---"}
                  </Typography>
                  <Typography>
                    Destination Address: {data.destination?.address ?? "---"}
                  </Typography>
                  <Typography>
                    Distance: {data.distanceKm ?? "---"} Km
                  </Typography>
                  <Typography>
                    Fare: PKR{" "}
                    {typeof data.fare === "object"
                      ? (data.fare.total ?? "---")
                      : (data.fare ?? "---")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider />

            {/* <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Status Timeline
              </Typography>
              {data.timeline?.length ? (
                <Stack spacing={1}>
                  {data.timeline.map((item, index) => (
                    <Box key={`${item.status}-${index}`}>
                      <Typography>
                        {item.status ?? "---"} —{" "}
                        {dayjs(item.updatedAt).format("DD MMM YYYY, h:mm A")}
                      </Typography>
                      {item.note && (
                        <Typography color="text.secondary">
                          {item.note}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  No timeline available.
                </Typography>
              )}
            </Box> */}

            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Audit Info
              </Typography>
              <Typography>
                Created Date:{" "}
                {dayjs(data.createdAt).format("DD MMM YYYY, h:mm A")}
              </Typography>
              <Typography>
                Last Updated:{" "}
                {dayjs(data.updatedAt).format("DD MMM YYYY, h:mm A")}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography>No trip details available.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
