import { useCallback, useMemo, useState } from "democrat";

export type InputListActions = {
  remove: () => void;
  set: (index: number, val: string) => void;
  add: () => void;
};

export function useInputList(): [Array<string>, InputListActions] {
  const [inputs, setInputs] = useState<Array<string>>([""]);

  const set = useCallback((index: number, val: string) => {
    setInputs((prev) => {
      if (index >= prev.length) {
        return prev;
      }
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  }, []);

  const add = useCallback(() => {
    setInputs((prev) => [...prev, ""]);
  }, []);

  const remove = useCallback(() => {
    setInputs((prev) => (prev.length <= 1 ? prev : prev.slice(0, prev.length - 1)));
  }, []);

  const actions = useMemo(
    () => ({
      remove,
      set,
      add,
    }),
    [add, remove, set]
  );

  return [inputs, actions];
}
