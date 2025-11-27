import api from "./apiService";

export const appointmentService = {
  // Book appointment
  async bookAppointment(data: {
    doctorId: string;
    dateTime: string;
    type: "video" | "chat";
    symptoms: string;
  }) {
    try {
      const response = await api.post("/appointments", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to book appointment",
      };
    }
  },

  // Get user appointments
  async getAppointments(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await api.get("/appointments", { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch appointments",
      };
    }
  },

  // Get appointment by ID
  async getAppointmentById(id: string) {
    try {
      const response = await api.get(`/appointments/${id}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch appointment",
      };
    }
  },

  // Cancel appointment
  async cancelAppointment(id: string, cancelReason?: string) {
    try {
      const response = await api.put(`/appointments/${id}/cancel`, {
        cancelReason,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to cancel appointment",
      };
    }
  },

  // Update status (doctor only)
  async updateAppointmentStatus(id: string, status: string) {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update status",
      };
    }
  },
};
