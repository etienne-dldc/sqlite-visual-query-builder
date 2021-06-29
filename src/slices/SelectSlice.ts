import { createFactory, useMemo, useState } from "democrat";
import { FactoryState } from "../logic/Utils";

type Props = {
  id: string;
};

export type SelectSliceState = FactoryState<typeof SelectSlice>;

export const SelectSlice = createFactory(({ id }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const sql = useMemo(() => {
    return `SELECT * FROM "table";`;
  }, []);

  return { type: "Select" as const, id, sql, collapsed, setCollapsed };
});
