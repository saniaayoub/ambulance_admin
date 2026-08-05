import { useState } from "react";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import {
  LockOutlined,
  MailOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppButton from "../../components/ui/Button";
import AppInput from "../../components/ui/InputField";
import Loader from "../../components/Loader/Loader";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);
  const loading = useAuthStore((state) => state.loading);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const mode = useThemeStore((state) => state.mode);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const response = await authService.login(values);
      const token = response?.data?.token || "";
      const user = response?.data?.user || { id: 0, fullName: "", email: "" };

      login(token, user);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: mode === "dark" ? "#101418" : "#F8FAFC",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <div
          style={{
            borderRadius: 20,
            padding: 32,
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background:
              mode === "dark"
                ? "linear-gradient(135deg, rgba(229,57,53,0.22), rgba(17,24,39,0.95))"
                : "linear-gradient(135deg, rgba(229,57,53,0.12), rgba(255,255,255,1))",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, marginBottom: 1 }}>
            Ambulance Admin
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 420 }}
          >
            Monitor trips, dispatch ambulances, and keep your operations moving
            smoothly.
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            padding: 32,
            borderRadius: 20,
            background: "#FFFFFF",
            boxShadow: "0 14px 40px rgba(15, 23, 42, 0.08)",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography variant="h4">Sign in</Typography>
              <Typography variant="body2" color="text.secondary">
                Access your admin dashboard
              </Typography>
            </div>
            <IconButton
              onClick={toggleMode}
              color="primary"
              aria-label="toggle theme"
            >
              {mode === "light" ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>

          <AppInput
            label="Email"
            placeholder="user@example.com"
            type="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email")}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlined color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password")}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <AppButton
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}
          >
            Login
          </AppButton>

          {loading && <Loader text="Authenticating..." />}
        </form>
      </div>
    </div>
  );
}
