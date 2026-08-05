import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AmbulationsPage from "../pages/Ambulances/AmbulancesPage";
import TripsPage from "../pages/Trips/TripsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import DriversPage from "../pages/Drivers/DriversPage";
import LoginPage from "../pages/Login/LoginPage";
import UsersPage from "../pages/Users/UsersPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import TripDetailsPage from "../pages/Trips/TripDetailsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="trips/:id" element={<TripDetailsPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="ambulances" element={<AmbulationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
