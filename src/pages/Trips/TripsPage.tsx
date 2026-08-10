import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TableCell,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/common/DataTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  dashboardService,
  type Trip,
  type TripStatus,
} from "../../services/dashboardService";
import dayjs from "dayjs";

const TRIP_STATUSES: Array<"ALL" | TripStatus> = [
  "ALL",
  "SEARCHING",
  "ASSIGNED",
  "WAITING",
  "STARTED",
  "COMPLETED",
  "CANCELLED",
];

const getStatusColor = (
  status?: string,
): "default" | "success" | "error" | "info" | "warning" => {
  const normalized = (status ?? "").toLowerCase();

  if (normalized.includes("completed")) return "success";
  if (normalized.includes("cancel")) return "error";
  if (normalized.includes("search") || normalized.includes("waiting"))
    return "warning";
  if (normalized.includes("assigned") || normalized.includes("started"))
    return "info";

  return "default";
};

export default function TripsPage() {
  const [rows, setRows] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | TripStatus>("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getTrips({
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          status: status === "ALL" ? undefined : status,
        });

        setRows(data.items ?? []);
        setTotal(data.total ?? 0);
        console.log(total, "k");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load trips.");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [page, rowsPerPage, debouncedSearch, status]);

  const handleAssignDriver = async (tripId?: string) => {
    if (!tripId) return;

    try {
      const response = await dashboardService.assignDriverToTrip(tripId);
      setRows((current) =>
        current.map((item) =>
          item._id === tripId || item.id === tripId
            ? { ...item, status: response?.status ?? "ASSIGNED" }
            : item,
        ),
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to assign driver.");
    }
  };

  const handleCancelTrip = async (tripId?: string) => {
    if (!tripId) return;

    try {
      const response = await dashboardService.cancelTrip(tripId);
      setRows((current) =>
        current.map((item) =>
          item._id === tripId || item.id === tripId
            ? { ...item, status: response?.status ?? "CANCELLED" }
            : item,
        ),
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to cancel trip.");
    }
  };

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Trips Management"
        subtitle="Monitor and manage trip requests"
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexwrap: "wrap",
          alignItems: "center",
          mb: 3,
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search By Patient or Driver"
        />

        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel id="trip-status-filter">Status</InputLabel>
          <Select
            labelId="trip-status-filter"
            value={status}
            label="Status"
            onChange={(event) => {
              setPage(0);
              setStatus(event.target.value as "ALL" | TripStatus);
            }}
          >
            {TRIP_STATUSES.map((item) => (
              <MenuItem key={item} value={item}>
                {item === "ALL" ? "All Status" : item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 3 }} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No trips found"
          description="Adjust the search or status filter to find matching trips."
        />
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <DataTable
            columns={[
              { key: "tripId", label: "Trip ID" },
              { key: "patient", label: "Patient" },
              { key: "driver", label: "Driver" },
              { key: "ambulance", label: "Ambulance" },
              { key: "pickup", label: "Pickup" },
              { key: "destination", label: "Destination" },
              { key: "status", label: "Status" },
              { key: "fare", label: "Fare" },
              { key: "createdAt", label: "Created Date" },
              { key: "action", label: "Actions" },
            ]}
            rows={rows}
            renderRow={(row) => (
              <>
                <TableCell>
                  {row._id?.slice(-6) ?? row.id?.slice(-6) ?? "---"}
                </TableCell>
                <TableCell>{row.userId?.fullName ?? "---"}</TableCell>
                <TableCell>
                  {row.driverId?.userId?.fullName ??
                    row.driverId?.fullName ??
                    "---"}
                </TableCell>
                <TableCell>{row.vehicleId?.vehicleNumber ?? "---"}</TableCell>
                <TableCell>{row.pickupLocation?.address ?? "---"}</TableCell>
                <TableCell>{row.destination?.address ?? "---"}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status ?? "UNKNOWN"}
                    color={getStatusColor(row.status)}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  {typeof row.fare === "object"
                    ? (row.fare.total ?? "---")
                    : (row.fare ?? "---")}
                </TableCell>
                <TableCell>
                  {dayjs(row.createdAt).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexwrap="wrap">
                    <Button
                      size="small"
                      variant="text"
                      color="primary"
                      onClick={() =>
                        navigate(`/dashboard/trips/${row._id ?? row.id}`)
                      }
                    >
                      View Trip
                    </Button>
                    {row.status === "SEARCHING" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleAssignDriver(row._id ?? row.id)}
                      >
                        Assign Driver
                      </Button>
                    )}
                    {(row.status === "SEARCHING" ||
                      row.status === "ASSIGNED" ||
                      row.status === "WAITING") && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelTrip(row._id ?? row.id)}
                      >
                        Cancel Trip
                      </Button>
                    )}
                  </Stack>
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
          />
        </Box>
      )}
    </div>
  );
}
