import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Chip, Skeleton, TableCell } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  dashboardService,
  type DriverItem,
} from "../../services/dashboardService";

export default function DriversPage() {
  const [rows, setRows] = useState<DriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getDrivers();
        setRows(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load drivers.");
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      `${row.name} ${row.phone}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [rows, search]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle="Driver roster and status overview"
      />
      <div style={{ marginBottom: 20 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search drivers"
        />
      </div>

      {loading ? (
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
      ) : filteredRows.length === 0 ? (
        <EmptyState
          title="No drivers found"
          description="Try a different search term."
        />
      ) : (
        <DataTable
          columns={[
            { key: "photo", label: "Photo" },
            { key: "name", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "status", label: "Status" },
            { key: "trips", label: "Trips" },
            { key: "action", label: "Action" },
          ]}
          rows={filteredRows}
          renderRow={(row) => (
            <>
              <TableCell>
                <Avatar src={row.photo} alt={row.name} />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  color={row.status === "Online" ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>{row.trips}</TableCell>
              <TableCell>
                <Button size="small" variant="text" color="primary">
                  View/Edit
                </Button>
              </TableCell>
            </>
          )}
        />
      )}
    </div>
  );
}
