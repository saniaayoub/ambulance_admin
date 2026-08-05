import { useEffect, useMemo, useState } from "react";
import { Button, Skeleton, TableCell } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  dashboardService,
  type UserItem,
} from "../../services/dashboardService";

export default function UsersPage() {
  const [rows, setRows] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getUsers();
        setRows(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
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
      <PageHeader title="Users" subtitle="User records and trip totals" />
      <div style={{ marginBottom: 20 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search users"
        />
      </div>

      {loading ? (
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
      ) : filteredRows.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try a different search term."
        />
      ) : (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "totalTrips", label: "Total Trips" },
            { key: "action", label: "Action" },
          ]}
          rows={filteredRows}
          renderRow={(row) => (
            <>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.totalTrips}</TableCell>
              <TableCell>
                <Button size="small" variant="text" color="primary">
                  View
                </Button>
              </TableCell>
            </>
          )}
        />
      )}
    </div>
  );
}
