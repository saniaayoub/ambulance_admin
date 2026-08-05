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
  photo: string;
  name: string;
  phone: string;
  status: string;
  trips: number;
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

      return {
        items: trips,
        total: payload?.total ?? payload?.count ?? trips.length,
        page: payload?.page ?? 1,
        limit: payload?.limit ?? trips.length,
        totalPages: payload?.totalPages ?? 1,
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
  getDrivers: async () => {
    try {
      const response = await api.get<DriverItem[]>(API_ENDPOINTS.drivers.root);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getDriverById: async (id: string) => {
    try {
      const response = await api.get<
        DriverItem & {
          personalInfo?: string;
          vehicle?: string;
          tripHistory?: string[];
        }
      >(API_ENDPOINTS.drivers.byId(id));
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getAmbulances: async () => {
    try {
      const response = await api.get<AmbulanceItem[]>(
        API_ENDPOINTS.ambulances.root,
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const response = await api.get<UserItem[]>(API_ENDPOINTS.users.root);
      return response.data;
    } catch (error: any) {
      throw error;
    }
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
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getSettings: async () => {
    try {
      const response = await api.get<SettingsData>(API_ENDPOINTS.settings.root);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  updateSettings: async (payload: SettingsData) => {
    try {
      const response = await api.put<SettingsData>(
        API_ENDPOINTS.settings.root,
        payload,
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
