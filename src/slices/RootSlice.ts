import { createFactory, useCallback, useChildren, useMemo, useState } from "democrat";
import { nanoid } from "nanoid";
import { expectNever, FactoryState } from "../logic/Utils";
import { CreateTableSlice } from "./CreateTableSlice";
import { SelectSlice } from "./SelectSlice";
import { format } from "sql-formatter";

type StatementType = "CreateTable" | "Select";

export type RootSliceState = FactoryState<typeof RootSlice>;

export const RootSlice = createFactory(() => {
  const [statementsList, setStatementsList] = useState<Array<{ type: StatementType; id: string }>>(() => []);

  const addStatement = useCallback((type: StatementType) => {
    setStatementsList((prev) => [...prev, { type, id: nanoid(6) }]);
  }, []);

  const removeStatement = useCallback((id: string) => {
    setStatementsList((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const statementsSlices = useChildren(
    statementsList.map(({ id, type }) => {
      if (type === "CreateTable") {
        return CreateTableSlice.createElement({ id }, id);
      }
      if (type === "Select") {
        return SelectSlice.createElement({ id }, id);
      }
      return expectNever(type);
    })
  );

  const sql = useMemo(
    () =>
      format("\n" + statementsSlices.map((s) => s.sql).join("\n\n"), {
        language: "sql",
        linesBetweenQueries: 2,
        keywordCase: "upper",
      }),
    [statementsSlices]
  );

  return { sql, statementsSlices, addStatement, removeStatement };
});
