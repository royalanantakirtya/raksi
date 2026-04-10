import api from "../lib/api";

export const getVisits = async () => {
  const response = await api.get("/visits");
  return response.data;
};

export const createVisitRequest = async (data: Record<string, string | number | boolean | null>) => {
  const response = await api.post("/visit-requests", data);
  return response.data;
};

export const getVisitById = async (id: number) => {
  const response = await api.get(`/visits/${id}`);
  return response.data;
};

export const createVisit = async (data: FormData | Record<string, string | number | File | null>) => {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
  const response = await api.post("/visits", data, { headers });
  return response.data;
};

export const fetchData = async (scheduleId: string | null, locationId: string | null, visitTypeId: string | null) => {
  // If scheduleId is provided, fetch schedule with its relations
  if (scheduleId) {
    const scheduleResponse = await api.get(`/schedules/${scheduleId}`);
    return {
      schedule: scheduleResponse.data.data,
      template: scheduleResponse.data.data.visit_type
    };
  }
  
  // If no scheduleId but location and type are provided (unplanned)
  if (locationId && visitTypeId) {
    const locationResponse = await api.get(`/locations/${locationId}`);
    const typeResponse = await api.get(`/visit-types/${visitTypeId}?include=checklistTemplates`);
    return {
      schedule: { location: locationResponse.data.data },
      template: typeResponse.data.data
    };
  }

  throw new Error("Invalid parameters for fetching visit data");
};
