import api from "./apiService";

export const healthRecordService = {
  // Upload health record
  async uploadRecord(data: FormData) {
    try {
      const response = await api.post("/records", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to upload record",
      };
    }
  },

  // Get health records
  async getRecords(params?: { type?: string; page?: number; limit?: number }) {
    try {
      const response = await api.get("/records", { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch records",
      };
    }
  },

  // Get record by ID
  async getRecordById(id: string) {
    try {
      const response = await api.get(`/records/${id}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch record",
      };
    }
  },

  // Delete record
  async deleteRecord(id: string) {
    try {
      const response = await api.delete(`/records/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete record",
      };
    }
  },
};
