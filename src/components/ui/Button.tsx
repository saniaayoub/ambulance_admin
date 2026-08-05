import type { ButtonProps } from "@mui/material/Button";
import { Button, CircularProgress } from "@mui/material";

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function AppButton({
  loading = false,
  disabled,
  children,
  ...props
}: AppButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      fullWidth
      type={props.type || "button"}
      sx={{
        borderRadius: 2,
        py: 1.25,
        fontWeight: 700,
        textTransform: "none",
        ...props.sx,
      }}
    >
      {loading ? <CircularProgress size={18} color="inherit" /> : children}
    </Button>
  );
}
