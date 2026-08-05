import { useEffect, useState } from "react";
import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import { dashboardService } from "../../services/dashboardService";

export default function UserDetailsPage() {
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
            <Typography>
              <strong>Profile Info:</strong> {data.profileInfo || data.name}
            </Typography>
            <Typography>
              <strong>Contact Info:</strong> {data.contactInfo || data.phone}
            </Typography>
            <Typography>
              <strong>Booking History:</strong>{" "}
              {(data.bookingHistory || []).join(", ") || "No booking history"}
            </Typography>
          </div>
        ) : (
          <Typography>No user details available.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
