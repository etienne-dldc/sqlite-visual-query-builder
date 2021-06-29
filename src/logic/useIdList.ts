import { nanoid } from "nanoid";
import { useCallback, useMemo, useState } from "democrat";

type Actions = {
  add: () => void;
  remove: (id: string) => void;
  set: React.Dispatch<React.SetStateAction<string[]>>;
};

export function useIdList(): [Array<string>, Actions] {
  const [list, setList] = useState<Array<string>>([]);

  const add = useCallback(() => {
    setList((prev) => [...prev, nanoid(6)]);
  }, []);

  const remove = useCallback((id: string) => {
    setList((prev) => prev.filter((c) => c !== id));
  }, []);

  const actions = useMemo(
    () => ({
      add,
      remove,
      set: setList,
    }),
    [add, remove]
  );

  return useMemo(() => [list, actions], [actions, list]);
}
