import { PressEvent } from "@heroui/button";
import { useCallback, useMemo, useRef } from "react";

export function useLongPress({
  onClick = () => {},
  onLongPress = () => {},
  ms = 300,
} = {}) {
  let timerRef = useRef<null | NodeJS.Timeout>(null);
  let eventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);

  const callback = useCallback(() => {
    if (!eventRef.current) return;
    onLongPress(eventRef.current);
    eventRef.current = null;
    timerRef.current = null;
  }, [onLongPress]);

  const start = useCallback(
    (ev: React.MouseEvent | React.TouchEvent) => {
      ev.persist();
      eventRef.current = ev;
      timerRef.current = setTimeout(callback, ms);
    },
    [callback, ms],
  );

  const stop = useCallback(
    (ev: React.MouseEvent | React.TouchEvent) => {
      ev.persist();
      eventRef.current = ev;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        onClick(eventRef.current);
        timerRef.current = null;
        eventRef.current = null;
      }
    },
    [onClick],
  );

  return useMemo(
    () => ({
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
    }),
    [start, stop],
  );
}
