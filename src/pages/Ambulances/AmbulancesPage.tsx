import { useEffect, useState } from "react";
import { Button, Chip, Skeleton, TableCell } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  dashboardService,
  type AmbulanceItem,
} from "../../services/dashboardService";

export default function AmbulancesPage() {
  const [rows, setRows] = useState<AmbulanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAmbulances = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getAmbulances();
        setRows(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load ambulances.");
      } finally {
        setLoading(false);
      }
    };

    loadAmbulances();
  }, []);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader title="Ambulances" subtitle="Fleet status and assignments" />

      {loading ? (
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No ambulances found"
          description="There are no fleet records yet."
        />
      ) : (
        <DataTable
          columns={[
            { key: "vehicleNumber", label: "Vehicle Number" },
            { key: "type", label: "Type" },
            { key: "assignedDriver", label: "Assigned Driver" },
            { key: "status", label: "Status" },
            { key: "action", label: "Action" },
          ]}
          rows={rows}
          renderRow={(row) => (
            <>
              <TableCell>{row.vehicleNumber}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.assignedDriver}</TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  color={row.status === "Available" ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button size="small" variant="text" color="primary">
                  Edit
                </Button>
              </TableCell>
            </>
          )}
        />
      )}
    </div>
  );
}
