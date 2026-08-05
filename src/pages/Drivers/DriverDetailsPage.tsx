import { useEffect, useState } from "react";
import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState";
import { dashboardService } from "../../services/dashboardService";

export default function DriverDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDriver = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const result = await dashboardService.getDriverById(id);
        setData(result);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load driver details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDriver();
  }, [id]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Driver Details
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
              <strong>Personal Info:</strong> {data.personalInfo || data.name}
            </Typography>
            <Typography>
              <strong>Vehicle:</strong> {data.vehicle || "---"}
            </Typography>
            <Typography>
              <strong>Trip History:</strong>{" "}
              {(data.tripHistory || []).join(", ") || "No trip history"}
            </Typography>
          </div>
        ) : (
          <Typography>No driver details available.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
