export const API_ENDPOINTS = {
  auth: {
    adminLogin: "auth/admin-login",
    profile: "auth/profile",
    logout: "auth/logout",
  },

  dashboard: {
    root: "admin/dashboard",
  },

  trips: {
    root: "admin/trips",
    byId: (id: string) => `admin/trips/${id}`,
    updateStatus: (id: string) => `admin/trips/${id}/status`,
    assignDriver: (id: string) => `admin/trips/${id}/assign-driver`,
    cancelTrips: (id: string) => `admin/trips/${id}/cancel`,
  },

  drivers: {
    root: "admin/drivers",
    create: "admin/create-driver",
    byId: (id: string) => `admin/drivers/${id}`,
    update: (id: string) => `admin/drivers/${id}`,
    delete: (id: string) => `admin/drivers/${id}`,
    updateStatus: (id: string) => `admin/drivers/${id}/status`,
    updateActive: (id: string) => `admin/drivers/${id}/active`,
  },

  ambulances: {
    root: "admin/ambulances",
    create: "admin/create-ambulance",
    byId: (id: string) => `admin/ambulances/${id}`,
    update: (id: string) => `admin/ambulances/${id}`,
    delete: (id: string) => `admin/ambulances/${id}`,
    updateStatus: (id: string) => `admin/ambulances/${id}/status`,
  },

  users: {
    root: "admin/users",
    byId: (id: string) => `admin/users/${id}`,
    status: (id: string) => `admin/users/${id}/status`,
    trips: (id: string) => `admin/users/${id}/trips`,
  },

  settings: {
    root: "admin/settings",
    update: "admin/settings",
  },
} as const;
