import type { TextFieldProps } from "@mui/material/TextField";
import { TextField } from "@mui/material";

export default function AppInput(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth
      variant={props.variant ?? "outlined"}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
        ...props.sx,
      }}
    />
  );
}
