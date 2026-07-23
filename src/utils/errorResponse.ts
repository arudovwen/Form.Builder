import { toast } from "sonner";

export const errorResponse = (
  error: any,
  defaultMessage: string = "An error occurred. Please try again."
) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.Message ||
    error?.message ||
    error?.Message ||
    defaultMessage;
  toast.error(message);
};
