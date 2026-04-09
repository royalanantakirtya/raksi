import api from "../lib/api";

export const getVisits = async () => {
  const response = await api.get("/visits");
  return response.data;
};

export const getVisitById = async (id: number) => {
  const response = await api.get(`/visits/${id}`);
  return response.data;
};

export const createVisit = async (data: any) => {
  const response = await api.post("/visits", data);
  return response.data;
};
