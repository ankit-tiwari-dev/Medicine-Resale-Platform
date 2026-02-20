import { useCallback, useEffect, useRef, useState } from "react";

export const useApiQuery = (fetcher, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");
  const fetcherRef = useRef(fetcher);

  // Update ref if fetcher changes (but don't trigger re-renders)
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetcherRef.current(...args);
      const payload = response?.data?.data ?? response?.data ?? null;
      setData(payload);
      return payload;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Request failed";
      setError(msg);
      return null; // Return null instead of throwing to prevent component crashes
    } finally {
      setLoading(false);
    }
  }, []); // Truly stable execute

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};
