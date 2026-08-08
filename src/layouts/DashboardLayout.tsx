import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BookOnlineRoundedIcon from "@mui/icons-material/BookOnlineRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon /> },
  {
    label: "Trips",
    path: "/dashboard/trips",
    icon: <BookOnlineRoundedIcon />,
  },
  {
    label: "Drivers",
    path: "/dashboard/drivers",
    icon: <DriveEtaRoundedIcon />,
  },
  {
    label: "Ambulances",
    path: "/dashboard/ambulances",
    icon: <LocalHospitalRoundedIcon />,
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: <PeopleRoundedIcon />,
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: <SettingsRoundedIcon />,
  },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebar = (
    <Box sx={{ width: 260, height: "100%", bgcolor: "background.paper", p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, px: 2, py: 2 }}>
        Ambulance Admin
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>{sidebar}</Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {sidebar}
      </Drawer>

      <Box sx={{ flex: 1 }}>
        {/* <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            bgcolor: "background.default",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" } }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, ml: 1 }}>
              Operations Dashboard
            </Typography>
          </Toolbar>
        </AppBar> */}

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
