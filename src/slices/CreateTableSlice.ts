import { createFactory, useCallback, useChildren } from "democrat";
import { useMemo, useState } from "democrat";
import { nanoid } from "nanoid";
import { useIdList } from "../logic/useIdList";
import { FactoryState, filterJoin } from "../logic/Utils";
import { ColumnDefSlice } from "./ColumnDefSlice";
import { TableConstraintSlice } from "./TableConstraintSlice";

type Props = {
  id: string;
};

export type CreateTableSliceState = FactoryState<typeof CreateTableSlice>;

export const CreateTableSlice = createFactory(({ id }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [tableName, setTableName] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [ifNotExist, setIfNotExist] = useState(false);
  const [columns, columnsActions] = useIdList();
  const [constraints, constraintsActions] = useIdList();

  const columnsSlices = useChildren(columns.map((id) => ColumnDefSlice.createElement({ id }, id)));

  const constraintsSlices = useChildren(constraints.map((id) => TableConstraintSlice.createElement({ id }, id)));

  const sql = useMemo(() => {
    return filterJoin(
      [
        `CREATE TABLE`,
        ifNotExist && "IF NOT EXIST",
        (schemaName.length > 0 ? `${schemaName}.` : "") + tableName,
        `(${filterJoin([...columnsSlices.map((col) => col.sql), ...constraintsSlices.map((col) => col.sql)], ", ")})`,
        `;`,
      ],
      " "
    );
  }, [columnsSlices, constraintsSlices, ifNotExist, schemaName, tableName]);

  return {
    type: "CreateTable" as const,
    id,
    sql,
    columnsSlices,
    constraintsSlices,
    tableName,
    setTableName,
    ifNotExist,
    setIfNotExist,
    columnsActions,
    constraintsActions,
    collapsed,
    setCollapsed,
    schemaName,
    setSchemaName,
  };
});
