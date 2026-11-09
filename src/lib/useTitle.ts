import { useEffect } from 'react';

const BASE = 'Dianna Claire Marie Amihan';
export function useTitle(page?: string, description?: string) {
  useEffect(() => {
    document.title = page ? `${page} — ${BASE}` : `${BASE} — Front-end & full-stack developer`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [page, description]);
}
