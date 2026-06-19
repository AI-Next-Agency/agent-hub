import { format } from "date-fns";

export function formatDateForHumans(isoDateString: string): string {
  return format(new Date(isoDateString), "dd MMMM yyyy");
}
