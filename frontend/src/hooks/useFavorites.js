import { useCallback, useEffect, useState } from 'react';
import { favoriteAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState(new Set());
  const [pending, setPending] = useState(new Set());

  useEffect(() => {
    if (!user) {
      setIds(new Set());
      return;
    }

    favoriteAPI
      .list()
      .then(({ data }) => {
        const next = new Set((data || []).map((item) => item.id));
        setIds(next);
      })
      .catch(() => {});
  }, [user]);

  const isSaved = useCallback((propertyId) => ids.has(propertyId), [ids]);

  const toggle = useCallback(async (propertyId) => {
    if (!user) return { ok: false, reason: 'auth' };
    if (pending.has(propertyId)) return { ok: false, reason: 'pending' };

    setPending((prev) => new Set(prev).add(propertyId));
    const previous = ids.has(propertyId);
    setIds((prev) => {
      const next = new Set(prev);
      if (previous) next.delete(propertyId);
      else next.add(propertyId);
      return next;
    });

    try {
      const { data } = await favoriteAPI.toggle(propertyId);
      setIds((prev) => {
        const next = new Set(prev);
        if (data.favorited) next.add(propertyId);
        else next.delete(propertyId);
        return next;
      });
      return { ok: true, favorited: data.favorited };
    } catch {
      setIds((prev) => {
        const next = new Set(prev);
        if (previous) next.add(propertyId);
        else next.delete(propertyId);
        return next;
      });
      return { ok: false };
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    }
  }, [ids, pending, user]);

  return { isSaved, toggle, user };
}
