import { useEffect, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  error: string;
  reload: () => void;
};

export function useFetch<T>(load: () => Promise<T>): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    load()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError('');
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load this page.');
      });

    return () => {
      active = false;
    };
  }, [load, version]);

  return { data, error, reload: () => setVersion((current) => current + 1) };
}
