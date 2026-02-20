import { useCallback, useState } from "react";

export const useAsyncAction = (asyncFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError("");
      try {
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        setError(err?.message || "Action failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { loading, error, execute };
};
