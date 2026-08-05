import { CircularProgress, Typography } from "@mui/material";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "24px 0",
      }}
    >
      <CircularProgress size={36} color="primary" />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </div>
  );
}
