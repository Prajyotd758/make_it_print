"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ApiRequestError } from "@/lib/api/client";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/lib/api/wishlist";

/** Wishlist heart state for listing / detail pages. */
export function useWishlistIds() {
  const { status: auth, data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  const [ids, setIds] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);

  const idsRef = useRef(ids);
  idsRef.current = ids;
  const inflight = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const notify = useCallback((msg: string) => {
    setNotice(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 2500);
  }, []);

  // load saved ids when logged in; clear on logout
  useEffect(() => {
    if (auth === "unauthenticated") {
      setIds(new Set());
      return;
    }
    if (!token) return;

    let cancelled = false;
    getWishlist(token)
      .then((list) => {
        if (cancelled) return;
        const server = new Set(list.map((p) => p._id));
        // keep optimistic state of toggles still in flight
        setIds((prev) => {
          inflight.current.forEach((id) =>
            prev.has(id) ? server.add(id) : server.delete(id)
          );
          return server;
        });
      })
      .catch(() => {
        /* non-critical: hearts just start empty */
      });

    return () => {
      cancelled = true;
    };
  }, [auth, token]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const setBusy = (id: string, on: boolean) =>
    setPending((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });

  const flip = (id: string, present: boolean) =>
    setIds((prev) => {
      const next = new Set(prev);
      present ? next.add(id) : next.delete(id);
      return next;
    });

  /** Optimistic toggle with rollback. Caller must check login first. */
  const toggle = useCallback(
    async (id: string) => {
      if (!token || inflight.current.has(id)) return;

      const wasWished = idsRef.current.has(id);
      inflight.current.add(id);
      setBusy(id, true);
      flip(id, !wasWished);

      try {
        if (wasWished) await removeFromWishlist(id, token);
        else await addToWishlist(id, token);
        notify(wasWished ? "Removed from wishlist" : "Saved to wishlist");
      } catch (e) {
        flip(id, wasWished); // rollback
        const status = e instanceof ApiRequestError ? e.status : 0;
        notify(
          status === 401
            ? "Session expired. Please sign in again."
            : status === 404
            ? "This product is no longer available."
            : status === 0
            ? "Couldn't reach the server. Try again."
            : "Couldn't update wishlist. Try again."
        );
      } finally {
        inflight.current.delete(id);
        setBusy(id, false);
      }
    },
    [token, notify]
  );

  return {
    ids,
    pending,
    notice,
    toggle,
    authed: auth === "authenticated" && !!token,
  };
}
