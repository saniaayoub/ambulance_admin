import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No records found",
  description = "Nothing is available yet.",
}: EmptyStateProps) {
  return (
    <Box sx={{ py: 5, textAlign: "center" }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
