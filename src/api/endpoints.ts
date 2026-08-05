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
    create: "admin/drivers",
    byId: (id: string) => `/drivers/${id}`,
    update: (id: string) => `/drivers/${id}`,
    delete: (id: string) => `/drivers/${id}`,
    updateStatus: (id: string) => `/drivers/${id}/status`,
  },

  ambulances: {
    root: "admin/ambulances",
    create: "admin/ambulances",
    byId: (id: string) => `/ambulances/${id}`,
    update: (id: string) => `/ambulances/${id}`,
    delete: (id: string) => `/ambulances/${id}`,
    updateStatus: (id: string) => `/ambulances/${id}/status`,
  },

  users: {
    root: "admin/users",
    byId: (id: string) => `/users/${id}`,
    updateStatus: (id: string) => `/users/${id}/status`,
  },

  settings: {
    root: "admin/settings",
    update: "admin/settings",
  },
} as const;
