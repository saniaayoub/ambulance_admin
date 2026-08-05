import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface DataTableProps<T extends object> {
  columns: Array<{ key: string; label: string }>;
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
}

export default function DataTable<T extends object>({
  columns,
  rows,
  renderRow,
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {column.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>{renderRow(row)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
