import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  TableCell,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import { dashboardService } from "../../services/dashboardService";
import DataTable from "../../components/common/DataTable";

export default function UserDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const result = await dashboardService.getUserById(id);
        setData(result);
        console.log(result, "res");
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load user details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          User Details
        </Typography>
        {loading ? (
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{ borderRadius: 3 }}
          />
        ) : data ? (
          <div style={{ display: "grid", gap: 12 }}>
            <Avatar
              src={data?.profileImage}
              sx={{
                width: 110,
                height: 110,
              }}
            />
            <Typography>
              <strong>Profile Info:</strong> {data.fullName || data.name}
            </Typography>
            <Typography>
              <strong>Contact Info:</strong> {data.phone}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Recent Bookings
              </Typography>

              {data.recentTrips?.length ? (
                <Box sx={{ overflowX: "auto" }}>
                  <DataTable
                    columns={[
                      { key: "id", label: "Trip ID" },
                      { key: "status", label: "Status" },
                      { key: "pickup", label: "Pickup" },
                      { key: "destination", label: "Destination" },
                      { key: "date", label: "Date" },
                      { key: "action", label: "Action" },
                    ]}
                    rows={data.recentTrips}
                    renderRow={(trip) => (
                      <>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {trip._id}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={trip.status}
                            size="small"
                            color={
                              trip.status === "COMPLETED"
                                ? "success"
                                : trip.status === "CANCELLED"
                                  ? "error"
                                  : "warning"
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {trip.pickupLocation?.address ||
                            trip.pickupLocation?.placeName ||
                            "-"}
                        </TableCell>

                        <TableCell>
                          {trip.destination?.address ||
                            trip.destination?.placeName ||
                            "-"}
                        </TableCell>

                        <TableCell>
                          {trip.createdAt
                            ? new Date(trip.createdAt).toLocaleDateString()
                            : "-"}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() =>
                              navigate(`/dashboard/trips/${trip._id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </>
                    )}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No booking history
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
        ) : (
          <Typography>No user details available.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
