import api from "../lib/api";

const newsService = {
  getAll: async () => {
    const response = await api.get("/news");
    return response.data;
  },
};

export default newsService;
