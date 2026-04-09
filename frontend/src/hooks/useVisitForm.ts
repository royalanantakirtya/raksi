import { useEffect } from "react";
import * as visitService from "../services/visitService";

// Define 'Schedule' and 'VisitType'
interface Schedule {
  id: string;
  location: string;
}

interface VisitType {
  id: string;
  nama_tipe: string;
}

export function useVisitForm(
  scheduleId: string | null,
  locationId: string | null,
  visitTypeId: string | null,
) {
  const [schedule, setSchedule] = useState<Partial<Schedule> | null>(null);
  const [template, setTemplate] = useState<VisitType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!scheduleId && (!locationId || !visitTypeId)) {
      setIsLoading(false);
      return;
    }

    // Fetch data logic
    visitService
      .fetchData(scheduleId, locationId, visitTypeId)
      .then((data) => {
        setSchedule(data.schedule);
        setTemplate(data.template);
      })
      .catch((err) => {
        setError("Failed to fetch data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [scheduleId, locationId, visitTypeId]);

  const submitForm = async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      await visitService.createVisit(formData);
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit visit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    schedule,
    template,
    isLoading,
    isSubmitting,
    error,
    success,
    submitForm,
  };
}
