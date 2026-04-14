import api from "../lib/api";

const scheduleService = {
  getToday: async (status?: string) => {
    const url = status ? `/schedules?status=${status}` : "/schedules";
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
};

export default scheduleService;
