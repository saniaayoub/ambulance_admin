import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useThemeStore } from "./stores/themeStore";
import { getAppTheme } from "./styles/theme";

function App() {
  const mode = useThemeStore((state) => state.mode);
  const theme = getAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" reverseOrder={false} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
