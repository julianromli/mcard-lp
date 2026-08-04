import { useCallback, useSyncExternalStore } from "react";

/* A media query React can branch on, not just CSS.

   The hero's two framings are a render-time fork rather than a styling one:
   the phone and the desktop mount different DOM, and each would carry its own
   copy of a 564KB iframe. Hiding one branch with a `hidden lg:block` would load
   both documents and only show one — so the choice has to happen before
   render, and it has to survive a rotate. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
