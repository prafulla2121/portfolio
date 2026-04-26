import { useEffect, useState } from "react";
import type { PortfolioData } from "../types/portfolio";

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Failed to load portfolio data.");
        }

        const payload = (await response.json()) as PortfolioData;
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return { data, loading, error };
}
