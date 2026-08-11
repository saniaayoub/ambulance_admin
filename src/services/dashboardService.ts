import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface DashboardApiResponse {
  stats: DashboardStats;
  recentTrips: RecentBooking[];
}

export interface DashboardStats {
  todayTrips: number;
  activeTrips: number;
  completedTrips: number;
  availableAmbulances: number;
  busyAmbulances: number;
  onlineDrivers: number;
  recentTrips: RecentBooking[];
}

export type TripStatus =
  | "SEARCHING"
  | "ASSIGNED"
  | "WAITING"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export interface TripLocation {
  address?: string;
  lat?: number;
  lng?: number;
}

export interface TripTimelineItem {
  status?: string;
  updatedAt?: string;
  note?: string;
}

export interface TripFare {
  total?: string | number;
  currency?: string;
}

export interface TripUser {
  _id?: string;
  fullName?: string;
  phone?: string;
}

export interface TripDriver {
  _id?: string;
  fullName?: string;
  phone?: string;
  userId?: {
    fullName?: string;
    phone?: string;
  };
  ambulanceId?: {
    _id?: string;
    vehicleNumber?: string;
    type?: string;
  };
}

export interface TripAmbulance {
  _id?: string;
  vehicleNumber?: string;
  type?: string;
}

export interface Trip {
  _id?: string;
  id?: string;
  userId?: TripUser;
  driverId?: TripDriver;
  ambulanceId?: TripAmbulance;
  pickupLocation?: TripLocation;
  destination?: TripLocation;
  status?: TripStatus;
  fare?: TripFare | string | number;
  distanceKm?: number | string;
  createdAt?: string;
  updatedAt?: string;
  timeline?: TripTimelineItem[];
}

export interface PaginatedTripsResponse {
  items?: Trip[];
  trips?: Trip[];
  pagination: {
    total?: number;
    pages?: number;
    limit?: number;
    page?: number;
  };
}

export interface PaginatedDriversResponse {
  items?: DriverItem[];
  drivers?: DriverItem[];
  total?: number;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface RecentBooking {
  _id?: string;
  id?: string;
  userId?: {
    _id?: string;
    fullName?: string;
    phone?: string;
  };
  driverId?: {
    _id?: string;
    fullName?: string;
    phone?: string;
    userId?: {
      fullName?: string;
      phone?: string;
    };
    ambulanceId?: {
      vehicleNumber?: string;
      type?: string;
    };
  };
  status?: string;
  date?: string;
  createdAt?: string;
  pickupAddress?: string;
  destinationAddress?: string;
  distance?: string | number;
  fare?: string | number;
}

export interface BookingItem {
  id: string;
  userId: string;
  driver: string;
  pickup: string;
  destination: string;
  status: string;
  date: string;
}

export interface DriverItem {
  id: string;
  user: {
    fullName: string;
    phone: string;
    profileImage: string;
  };
  vehicle: {
    vehicleType: string;
  };
  isOnline: boolean;
  completedTrips: number;
  totalCompletedTrips: number;
  status: string;
}

export interface AmbulanceItem {
  id: string;
  vehicleNumber: string;
  type: string;
  assignedDriver: string;
  status: string;
}

export interface UserItem {
  id: string;
  name: string;
  phone: string;
  totalTrips: number;
}

export interface SettingsData {
  companyName: string;
  supportPhone: string;
  emergencyPhone: string;
}
export interface UserItem {
  _id: string;
  fullName: string;
  phone: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;

  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;

  createdAt: string;
}

export interface Settings {
  _id: string;

  waitingFreeMinutes: number;

  driverSearchRadiusKm: number;

  notifications: {
    bookingCreated: boolean;
    driverAssigned: boolean;
    tripCompleted: boolean;
  };

  appName: string;
  supportPhone: string;
  supportEmail: string;
}

export interface UsersResponse {
  items: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export const dashboardService = {
  getDashboard: async () => {
    try {
      const response = await api.get<ApiEnvelope<DashboardApiResponse>>(
        API_ENDPOINTS.dashboard.root,
      );
      const payload = response.data?.data ?? response.data;
      return payload;
    } catch (error: any) {
      throw error;
    }
  },

  getTrips: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    try {
      const response = await api.get<ApiEnvelope<PaginatedTripsResponse>>(
        API_ENDPOINTS.trips.root,
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
            search: params?.search || undefined,
            status: params?.status || undefined,
          },
        },
      );

      const payload = response.data?.data ?? response.data;
      const trips = payload?.items ?? payload?.trips ?? [];
      const pagination = payload?.pagination;

      return {
        items: trips,
        total: pagination?.total ?? trips.length,
        page: pagination?.page ?? 1,
        limit: pagination?.limit ?? trips.length,
        pages: pagination?.pages ?? 1,
      };
    } catch (error) {
      throw error;
    }
  },
  getTripById: async (id: string) => {
    try {
      const response = await api.get<ApiEnvelope<Trip>>(
        API_ENDPOINTS.trips.byId(id),
      );
      return response.data?.data ?? response.data;
    } catch (error: any) {
      throw error;
    }
  },
  assignDriverToTrip: async (id: string) => {
    try {
      const response = await api.post<ApiEnvelope<Trip>>(
        API_ENDPOINTS.trips.assignDriver(id),
      );
      return response.data?.data ?? response.data;
    } catch (error: any) {
      throw error;
    }
  },
  cancelTrip: async (id: string) => {
    try {
      const response = await api.post<ApiEnvelope<Trip>>(
        API_ENDPOINTS.trips.cancelTrips(id),
      );
      return response.data?.data ?? response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getDrivers: async ({
    page,
    limit,
    search,
    status,
    isOnline,
    isAvailable,
    ambulanceType,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    isOnline?: string;
    isAvailable?: string;
    ambulanceType?: string;
  }) => {
    const response = await api.get(API_ENDPOINTS.drivers.root, {
      params: {
        page,
        limit,
        search,
        status,
        isOnline,
        isAvailable,
        ambulanceType,
      },
    });

    return response.data.data;
  },

  getDriverById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.drivers.byId(id));
    return response.data;
  },
  createDriver: async (data: FormData) => {
    const response = await api.post(API_ENDPOINTS.drivers.create, data);

    return response.data;
  },

  updateDriver: async (id: string, data: FormData) => {
    const response = await api.put(API_ENDPOINTS.drivers.update(id), data);
    return response.data;
  },

  updateDriverActive: async (id: string, isActive: boolean) => {
    const response = await api.patch(API_ENDPOINTS.drivers.updateActive(id), {
      isActive,
    });

    return response.data;
  },

  updateDriverStatus: async (id: string, status: string) => {
    const response = await api.patch(API_ENDPOINTS.drivers.updateStatus(id), {
      status,
    });

    return response.data;
  },

  getAmbulances: async ({
    page,
    limit,
    search,
    status,
    type,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
  }) => {
    try {
      const response = await api.get(API_ENDPOINTS.ambulances.root, {
        params: {
          page,
          limit,
          search,
          status,
          type,
        },
      });
      return response?.data?.data ?? response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getAmbulanceById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.ambulances.byId(id));

    return response.data;
  },

  updateAmbulance: async (
    id: string,
    data: {
      vehicleNumber: string;
      model: string;
      vehicleType: string;
      driverId: string;
    },
  ) => {
    const response = await api.put(API_ENDPOINTS.ambulances.update(id), data);

    return response.data;
  },
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<UsersResponse> => {
    const response = await api.get(API_ENDPOINTS.users.root, {
      params,
    });

    return response.data.data;
  },
  getUserById: async (id: string) => {
    try {
      const response = await api.get<
        UserItem & {
          profileInfo?: string;
          contactInfo?: string;
          bookingHistory?: string[];
        }
      >(API_ENDPOINTS.users.byId(id));
      return response.data.data ?? response.data;
    } catch (error: any) {
      throw error;
    }
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    try {
      const response = await api.patch(API_ENDPOINTS.users.status(id), {
        isActive,
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  getSettings: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.settings.root);

      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },
  updateSettings: async (payload: SettingsData) => {
    try {
      const response = await api.patch(API_ENDPOINTS.settings.root, payload);

      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },
};
