import { createFactory, useMemo, useState } from "democrat";
import { useInputList } from "../logic/useInputList";
import { expectNever, FactoryState, filterJoin } from "../logic/Utils";

export const TABLE_CONSTRAINT_TYPE = ["PRIMARY KEY", "UNIQUE", "CHECK", "FOREIGN KEY"] as const;
export type TableConstraintType = typeof TABLE_CONSTRAINT_TYPE[number];

type Props = {
  id: string;
};

export type TableConstraintSliceState = FactoryState<typeof TableConstraintSlice>;

export const TableConstraintSlice = createFactory(({ id }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [constraintType, setConstraintType] = useState<TableConstraintType>("PRIMARY KEY");
  const [primaryColumns, primaryColumnsActions] = useInputList();
  const [uniqueColumns, uniqueColumnsActions] = useInputList();
  const [checkExpr, setCheckExpr] = useState("");
  const [foreignColumns, foreignColumnsActions] = useInputList();

  const constraintSql = useMemo(() => {
    if (constraintType === "PRIMARY KEY") {
      return `PRIMARY KEY (${primaryColumns.join(", ")})`;
    }
    if (constraintType === "CHECK") {
      return `CHECK (${checkExpr})`;
    }
    if (constraintType === "FOREIGN KEY") {
      return `FOREIGN KEY (${foreignColumns.join(", ")})`;
    }
    if (constraintType === "UNIQUE") {
      return `UNIQUE (${uniqueColumns.join(", ")})`;
    }
    expectNever(constraintType);
  }, [checkExpr, constraintType, foreignColumns, primaryColumns, uniqueColumns]);

  const sql = useMemo(() => {
    return filterJoin([`CONSTRAINT`, name, constraintSql], " ");
  }, [constraintSql, name]);

  return {
    id,
    sql,
    collapsed,
    setCollapsed,
    name,
    setName,
    constraintType,
    setConstraintType,
    primaryColumns,
    primaryColumnsActions,
    uniqueColumns,
    uniqueColumnsActions,
    checkExpr,
    setCheckExpr,
    foreignColumns,
    foreignColumnsActions,
  };
});
