"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getWishlist,
  removeManyFromWishlist,
  WishlistProduct,
} from "@/lib/api/wishlist";

export type WishlistStatus = "loading" | "ready" | "error";

export function useWishlist() {
  const { status: auth, data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [status, setStatus] = useState<WishlistStatus>("loading");
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const inflight = useRef<Set<string>>(new Set());
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>();

  const notify = useCallback((msg: string) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setStatus("loading");
    try {
      setItems(await getWishlist(token));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [token]);

  useEffect(() => {
    if (auth === "authenticated" && token) load();
    return () => clearTimeout(noticeTimer.current);
  }, [auth, token, load]);

  const setBusy = (ids: string[], on: boolean) =>
    setPending((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });

  /** Optimistic remove with rollback of failed items. */
  const remove = useCallback(
    async (ids: string[]) => {
      if (!token) return;
      const toRemove = ids.filter((id) => !inflight.current.has(id));
      if (!toRemove.length) return;
      toRemove.forEach((id) => inflight.current.add(id));
      setBusy(toRemove, true);

      const removed = itemsRef.current
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => toRemove.includes(item._id));
      setItems((prev) => prev.filter((p) => !toRemove.includes(p._id)));

      const { failed } = await removeManyFromWishlist(toRemove, token);

      if (failed.length) {
        const restore = removed
          .filter(({ item }) => failed.includes(item._id))
          .sort((a, b) => a.index - b.index);
        setItems((prev) => {
          const next = [...prev];
          restore.forEach(({ item, index }) =>
            next.splice(Math.min(index, next.length), 0, item)
          );
          return next;
        });
        notify(
          failed.length === toRemove.length
            ? "Couldn't remove from wishlist. Try again."
            : `Couldn't remove ${failed.length} of ${toRemove.length} items.`
        );
      } else {
        notify(
          toRemove.length === 1
            ? "Removed from wishlist"
            : `Removed ${toRemove.length} items`
        );
      }

      toRemove.forEach((id) => inflight.current.delete(id));
      setBusy(toRemove, false);
    },
    [notify, token]
  );

  return { auth, items, status, pending, notice, notify, load, remove };
}
