import api from "./apiService";

export const medicineService = {
  // Get all medicines
  async getMedicines(params?: {
    search?: string;
    category?: string;
    pharmacyId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await api.get("/medicines", { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch medicines",
      };
    }
  },

  // Get medicine by ID
  async getMedicineById(id: string) {
    try {
      const response = await api.get(`/medicines/${id}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch medicine",
      };
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await api.get("/medicines/categories");
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch categories",
      };
    }
  },

  // Get pharmacies
  async getPharmacies(params?: {
    search?: string;
    isOpen?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await api.get("/pharmacies", { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch pharmacies",
      };
    }
  },

  // Get pharmacy by ID
  async getPharmacyById(id: string) {
    try {
      const response = await api.get(`/pharmacies/${id}`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch pharmacy",
      };
    }
  },
};
