import api from '../api';
import { toast } from 'react-toastify';

const BASE_URL = "/activity-logs";

export const activityLogService = {
  async getLogs(filters = {}) {
    try {
      const queryFilters = {
        ...filters,
        sort: "-createdAt",
        limit: 20
      };

      const queryParams = new URLSearchParams(queryFilters).toString();
      const response = await api.get(`${BASE_URL}?${queryParams}`);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw error;
    }
  }
};
