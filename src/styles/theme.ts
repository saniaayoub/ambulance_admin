import { createTheme } from "@mui/material/styles";
import "./theme.css";

const basePalette = {
  primary: {
    main: "#E53935",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FFFFFF",
    contrastText: "#1F2937",
  },
};

export const getAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: basePalette.primary,
      secondary: basePalette.secondary,
      background: {
        default: mode === "dark" ? "#101418" : "#F8FAFC",
        paper: mode === "dark" ? "#171C22" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#F8FAFC" : "#111827",
        secondary: mode === "dark" ? "#CBD5E1" : "#6B7280",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h4: {
        fontWeight: 700,
      },
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "0 14px 40px rgba(15, 23, 42, 0.08)",
          },
        },
      },
    },
  });
