import { createFactory, useCallback, useChildren } from "democrat";
import { useMemo, useState } from "democrat";
import { nanoid } from "nanoid";
import { FactoryState, filterJoin } from "../logic/Utils";

type Props = {
  id: string;
};

export type CreateTableSliceState = FactoryState<typeof CreateTableSlice>;

export const CreateTableSlice = createFactory(({ id }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [tableName, setTableName] = useState<string>("table");
  const [ifNotExist, setIfNotExist] = useState(false);
  const [columns, setColumns] = useState<Array<string>>([]);

  const columnsSlices = useChildren(
    columns.map((id) => ColumnSlice.createElement({ id }, id))
  );

  const addColumn = useCallback(() => {
    setColumns((prev) => [...prev, nanoid(6)]);
  }, []);

  const removeColumn = useCallback((id: string) => {
    setColumns((prev) => prev.filter((c) => c !== id));
  }, []);

  const sql = useMemo(() => {
    return filterJoin(
      [
        `CREATE TABLE`,
        ifNotExist && "IF NOT EXIST",
        tableName,
        `(${filterJoin(
          columnsSlices.map((col) => col.sql),
          ", "
        )})`,
        `;`,
      ],
      " "
    );
  }, [columnsSlices, ifNotExist, tableName]);

  return {
    type: "CreateTable" as const,
    id,
    sql,
    tableName,
    setTableName,
    ifNotExist,
    setIfNotExist,
    addColumn,
    removeColumn,
    columnsSlices,
    collapsed,
    setCollapsed,
  };
});

export const DATA_TYPE = ["NULL", "INTEGER", "REAL", "TEXT", "BLOB"] as const;
export type DataType = typeof DATA_TYPE[number];

export type ColumnSliceState = FactoryState<typeof ColumnSlice>;

const ColumnSlice = createFactory(({ id }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState("col");
  const [dataType, setDataType] = useState<DataType>("TEXT");
  const [notNull, setNotNull] = useState(false);
  const [primary, setPrimary] = useState(false);
  const [unique, setUnique] = useState(false);
  const [references, setReferences] = useState(false);
  const [foreignTable, setForeignTable] = useState("");
  const [foreignColumns, setForeignColumnsInternal] = useState<Array<string>>([
    "",
  ]);

  const setForeignColumn = useCallback((index: number, val: string) => {
    setForeignColumnsInternal((prev) => {
      if (index >= prev.length) {
        return prev;
      }
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  }, []);

  const addForeignColumn = useCallback(() => {
    setForeignColumnsInternal((prev) => [...prev, ""]);
  }, []);

  const removeForeignColumn = useCallback(() => {
    setForeignColumnsInternal((prev) =>
      prev.length <= 1 ? prev : prev.slice(0, prev.length - 1)
    );
  }, []);

  const sql = useMemo(
    () =>
      filterJoin(
        [
          name,
          dataType,
          notNull && "NOT NULL",
          primary && "PRIMARY",
          unique && "UNIQUE",
          references &&
            filterJoin(
              [
                "REFERENCES",
                `${foreignTable}(${filterJoin(foreignColumns, ", ")})`,
              ],
              " "
            ),
        ],
        " "
      ),
    [
      dataType,
      foreignColumns,
      foreignTable,
      name,
      notNull,
      primary,
      references,
      unique,
    ]
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
    setForeignColumn,
    addForeignColumn,
    removeForeignColumn,
  };
});
