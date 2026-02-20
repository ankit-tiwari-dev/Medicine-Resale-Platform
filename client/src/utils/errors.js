export const extractErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;
  const responseMessage = error?.response?.data?.message;
  if (responseMessage) return responseMessage;
  if (error.message) return error.message;
  return fallback;
};

export const isRateLimited = (error) => error?.response?.status === 429;
