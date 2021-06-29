import { createFactory, useState, useCallback, useMemo } from "democrat";
import { useInputList } from "../logic/useInputList";
import { FactoryState, filterJoin } from "../logic/Utils";

export const DATA_TYPE = ["NULL", "INTEGER", "REAL", "TEXT", "BLOB"] as const;
export type DataType = typeof DATA_TYPE[number];

export type ColumnDefSliceState = FactoryState<typeof ColumnDefSlice>;

type Props = {
  id: string;
};

export const ColumnDefSlice = createFactory(({ id }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState("col");
  const [dataType, setDataType] = useState<DataType>("TEXT");
  const [notNull, setNotNull] = useState(false);
  const [primary, setPrimary] = useState(false);
  const [unique, setUnique] = useState(false);
  const [references, setReferences] = useState(false);
  const [foreignTable, setForeignTable] = useState("");
  const [foreignColumns, foreignColumnsActions] = useInputList();

  const sql = useMemo(
    () =>
      filterJoin(
        [
          name,
          dataType,
          notNull && "NOT NULL",
          primary && "PRIMARY",
          unique && "UNIQUE",
          references && filterJoin(["REFERENCES", `${foreignTable}(${filterJoin(foreignColumns, ", ")})`], " "),
        ],
        " "
      ),
    [dataType, foreignColumns, foreignTable, name, notNull, primary, references, unique]
  );

  return {
    id,
    sql,
    name,
    setName,
    dataType,
    setDataType,
    notNull,
    setNotNull,
    primary,
    setPrimary,
    unique,
    setUnique,
    collapsed,
    setCollapsed,
    references,
    setReferences,
    foreignTable,
    setForeignTable,
    foreignColumns,
    foreignColumnsActions,
  };
});
