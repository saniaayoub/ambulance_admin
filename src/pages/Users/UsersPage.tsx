import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Skeleton,
  TableCell,
  TablePagination,
  TextField,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router";

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

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // Search debounce
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());

      setPage(0);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getUsers({
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          status,
        });

        setRows(data?.items ?? []);
        setTotal(data?.total ?? 0);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page, rowsPerPage, debouncedSearch, status]);

  if (error) {
    return <ErrorState title="Failed to load users" description={error} />;
  }

  return (
    <Box>
      <PageHeader
        title="Users"
        description="Manage patients and view their trip history."
      />

      {/* Filters */}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search name or phone..."
          />
        </Box>

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          sx={{
            minWidth: {
              xs: "100%",
              sm: 160,
            },
          }}
        >
          <MenuItem value="">All</MenuItem>

          <MenuItem value="ACTIVE">Active</MenuItem>

          <MenuItem value="INACTIVE">Inactive</MenuItem>
        </TextField>
      </Box>

      {/* Table */}

      {loading ? (
        <Skeleton
          variant="rectangular"
          height={350}
          sx={{
            borderRadius: 3,
          }}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No users found"
          description={
            search || status
              ? "Try changing your search or filter."
              : "There are no registered users yet."
          }
        />
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <DataTable
            columns={[
              {
                key: "user",
                label: "User",
              },
              {
                key: "phone",
                label: "Phone",
              },
              {
                key: "totalTrips",
                label: "Total Trips",
              },
              {
                key: "completed",
                label: "Completed",
              },
              {
                key: "cancelled",
                label: "Cancelled",
              },
              {
                key: "verified",
                label: "Verified",
              },
              {
                key: "joined",
                label: "Joined",
              },
              {
                key: "action",
                label: "Action",
              },
            ]}
            rows={rows}
            renderRow={(row) => (
              <>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Avatar src={row.profileImage} alt={row.fullName} />

                    <Box>{row.fullName}</Box>
                  </Box>
                </TableCell>

                <TableCell>{row.phone}</TableCell>

                <TableCell>{row.totalTrips}</TableCell>

                <TableCell>{row.completedTrips}</TableCell>

                <TableCell>{row.cancelledTrips}</TableCell>

                <TableCell>
                  <Chip
                    label={row.isVerified ? "Verified" : "Not Verified"}
                    color={row.isVerified ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate(`/dashboard/users/${row._id}`)}
                  >
                    View
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
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </Box>
  );
}
