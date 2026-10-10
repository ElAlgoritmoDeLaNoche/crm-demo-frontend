import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
export function useCollection(resource, token, onExpired) {
  const [records, setRecords] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRecords(await api("/" + resource, { token }));
    } catch (e) {
      setError(e.message);
      if (e.status === 401) onExpired();
    } finally {
      setLoading(false);
    }
  }, [resource, token, onExpired]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) reload();
    });
    return () => {
      active = false;
    };
  }, [reload]);
  return { records, loading, error, reload };
}
