"use client";

import { useEffect, useRef } from "react";

type ShortcutMap = {
  gF?: () => void;
  gA?: () => void;
  slash?: () => void;
  openPalette?: () => void;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

export function useNavigationShortcuts(handlers: ShortcutMap) {
  const awaitingSecondKey = useRef(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        handlers.openPalette?.();
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        handlers.slash?.();
        handlers.openPalette?.();
        return;
      }

      if (key === "g" && !isTypingTarget(event.target)) {
        awaitingSecondKey.current = true;
        if (timeout.current) window.clearTimeout(timeout.current);
        timeout.current = window.setTimeout(() => {
          awaitingSecondKey.current = false;
        }, 900);
        return;
      }

      if (!awaitingSecondKey.current) return;
      awaitingSecondKey.current = false;

      if (key === "f") {
        event.preventDefault();
        handlers.gF?.();
      } else if (key === "a") {
        event.preventDefault();
        handlers.gA?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, [handlers]);
}
