import api from "../lib/api";

export interface VisitRequest {
  id: string;
  visitorName: string;
  visitDate: string;
  status: string;
}

const visitRequestService = {
  getAll: async (): Promise<VisitRequest[]> => {
    const response = await api.get("/visit-requests");
    return response.data;
  },

  create: async (data: Record<string, string | number | boolean | null>): Promise<VisitRequest> => {
    const response = await api.post("/visit-requests", data);
    return response.data;
  },
};

export default visitRequestService;
