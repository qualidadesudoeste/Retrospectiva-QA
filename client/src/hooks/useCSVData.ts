import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCSVData<T>(filePath: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(filePath)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse<T>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
          error: (err: Error) => {
            setError(err);
            setLoading(false);
          }
        });
      })
      .catch((err: Error) => {
        setError(err);
        setLoading(false);
      });
  }, [filePath]);

  return { data, loading, error };
}

