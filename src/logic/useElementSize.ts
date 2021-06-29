import { useLayoutEffect, useEffect, MutableRefObject, useCallback, useState, useMemo, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Result {
  width: number | undefined;
  height: number | undefined;
  ref: React.MutableRefObject<HTMLElement | null>;
}

function getSize(el: HTMLElement | null) {
  if (!el) {
    return {
      width: undefined,
      height: undefined,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

export function useElementSize(ref?: MutableRefObject<HTMLElement | null>): Result {
  const usedRef = useOrCreateRef<HTMLElement | null>(null, ref);
  const node = useRefInState(usedRef);
  const [size, setSize] = useState(getSize(node));

  const handleResize = useCallback(
    function handleResize() {
      if (node) {
        setSize(getSize(node));
      }
    },
    [node]
  );

  useIsomorphicLayoutEffect(() => {
    if (!node) {
      return;
    }

    handleResize();

    let resizeObserver: ResizeObserver | null = new ResizeObserver(() => handleResize());
    resizeObserver.observe(node);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
  }, [handleResize, node]);

  const result = useMemo(
    () => ({
      width: size.width,
      height: size.height,
      ref: usedRef,
    }),
    [size.height, size.width, usedRef]
  );

  return result;
}

function useOrCreateRef<T>(
  initialValue: T,
  ...maybeRefs: Array<MutableRefObject<T> | null | undefined>
): MutableRefObject<T> {
  const localRef = useRef<T>(initialValue);
  const maybeRef = maybeRefs.find((ref) => !!ref);
  return maybeRef ? maybeRef : localRef;
}

function useRefInState<T>(ref: MutableRefObject<T>): T {
  const [val, setVal] = useState<T>(ref.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (val !== ref.current) {
      setVal(ref.current);
    }
  });
  return val;
}
