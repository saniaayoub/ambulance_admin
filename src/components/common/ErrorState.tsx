import { Alert, Box } from "@mui/material";

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({
  message = "Something went wrong while loading the data.",
}: ErrorStateProps) {
  return (
    <Box sx={{ py: 3 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}
