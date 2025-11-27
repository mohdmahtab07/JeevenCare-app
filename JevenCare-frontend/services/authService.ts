import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./apiService";

const AUTH_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

export const authService = {
  // Save tokens
  async saveTokens(accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Save user data
  async saveUserData(userData: any) {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  // Get user data
  async getUserData() {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  },

  // Register user
  async register(
    phoneNumber: string,
    name: string,
    role: string,
    email?: string,
    address?: string
  ) {
    try {
      const response = await api.post("/auth/register", {
        phone: phoneNumber,
        name,
        role,
        email,
        address,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  // Send OTP
  async sendOTP(phoneNumber: string) {
    try {
      const response = await api.post("/auth/send-otp", {
        phone: phoneNumber,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      };
    }
  },

  // Verify OTP and login
  async verifyOTP(phoneNumber: string, otp: string) {
    try {
      const response = await api.post("/auth/verify-otp", {
        phone: phoneNumber,
        otp,
      });

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data.data;
        await this.saveTokens(accessToken, refreshToken);
        await this.saveUserData(user);
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "OTP verification failed",
      };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        await this.saveUserData(response.data.data);
      }
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch user",
      };
    }
  },

  // Logout
  async logout() {
    try {
      // Call backend logout endpoint
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear all local storage regardless of API call result
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_DATA_KEY,
      ]);
      console.log("✅ User logged out, all data cleared");
    }
  },
};
