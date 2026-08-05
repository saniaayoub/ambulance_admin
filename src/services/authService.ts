import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.adminLogin, payload);
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      console.log(status, error?.response, "error");
      throw error;
    }
  },
};
