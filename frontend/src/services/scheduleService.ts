import api from "../lib/api";

const scheduleService = {
  getToday: async () => {
    const response = await api.get("/schedules");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
};

export default scheduleService;
