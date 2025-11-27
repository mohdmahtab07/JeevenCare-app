import api from "./apiService";

export const doctorService = {
  // Get all doctors
  async getDoctors(params?: {
    specialization?: string;
    language?: string;
    minFee?: number;
    maxFee?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await api.get("/doctors", { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch doctors",
      };
    }
  },

  // Get single doctor
  // Get single doctor
  async getDoctorById(id: string) {
    try {
      const response = await api.get(`/doctors/${id}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch doctor",
      };
    }
  },
  // Get specializations
  async getSpecializations() {
    try {
      const response = await api.get("/doctors/specializations");
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch specializations",
      };
    }
  },
};
