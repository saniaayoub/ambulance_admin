import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Skeleton,
  TableCell,
  TablePagination,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  // Load ambulances
  useEffect(() => {
    console.log("k");
    const loadAmbulances = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getAmbulances({
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          type,
          status,
        });

        setRows(data?.items ?? []);
        setTotal(data?.total ?? 0);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load ambulances.");
      } finally {
        setLoading(false);
      }
    };

    loadAmbulances();
  }, [page, rowsPerPage, debouncedSearch, type, status]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
    setPage(0);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "AVAILABLE":
        return "success";

      case "BUSY":
        return "warning";

      case "OFFLINE":
        return "default";

      default:
        return "default";
    }
  };

  if (error) {
    return (
      <ErrorState message="Failed to load ambulances" description={error} />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Ambulances"
        description="Manage your ambulance fleet and assignments."
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
            minWidth: 0,
          }}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search vehicle number or model..."
          />
        </Box>

        <TextField
          select
          size="small"
          label="Type"
          value={type}
          onChange={handleTypeChange}
          sx={{
            minWidth: {
              xs: "100%",
              sm: 170,
            },
          }}
        >
          <MenuItem value="">All Types</MenuItem>

          <MenuItem value="NORMAL">Normal</MenuItem>

          <MenuItem value="VENTILATOR">Ventilator</MenuItem>

          <MenuItem value="DEAD_BODY">Dead Body</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={handleStatusChange}
          sx={{
            minWidth: {
              xs: "100%",
              sm: 170,
            },
          }}
        >
          <MenuItem value="">All Status</MenuItem>

          <MenuItem value="AVAILABLE">Available</MenuItem>

          <MenuItem value="BUSY">Busy</MenuItem>

          <MenuItem value="OFFLINE">Offline</MenuItem>
        </TextField>
      </Box>

      {/* Table */}

      {loading ? (
        <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 3 }} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No ambulances found"
          description={
            search || type || status
              ? "Try changing your search or filters."
              : "There are no ambulance records yet."
          }
        />
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <DataTable
            columns={[
              {
                key: "vehicleNumber",
                label: "Vehicle Number",
              },
              {
                key: "model",
                label: "Model",
              },
              {
                key: "type",
                label: "Type",
              },
              {
                key: "driver",
                label: "Assigned Driver",
              },
              {
                key: "status",
                label: "Status",
              },
              {
                key: "action",
                label: "Action",
              },
            ]}
            rows={rows}
            renderRow={(row) => (
              <>
                {/* Vehicle Number */}

                <TableCell>{row.vehicleNumber || "-"}</TableCell>

                {/* Model */}

                <TableCell>{row.model || "-"}</TableCell>

                {/* Type */}

                <TableCell>{row.vehicleType || "-"}</TableCell>

                {/* Driver */}

                <TableCell>
                  {row.driver?.user ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Avatar
                        src={row.driver.user.profileImage}
                        alt={row.driver.user.fullName}
                        sx={{
                          width: 32,
                          height: 32,
                        }}
                      />

                      <Box>
                        <Box>{row.driver.user.fullName}</Box>

                        <Box
                          sx={{
                            fontSize: 12,
                            color: "text.secondary",
                          }}
                        >
                          {row.driver.user.phone}
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Chip label="Unassigned" size="small" variant="outlined" />
                  )}
                </TableCell>

                {/* Status */}

                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </TableCell>

                {/* Action */}

                <TableCell>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => navigate(`/dashboard/ambulances/${row._id}`)}
                  >
                    View / Edit
                  </Button>
                </TableCell>
              </>
            )}
          />

          {/* Pagination */}

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, nextPage) => {
              setPage(nextPage);
            }}
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
