import React, { Fragment } from "react";
import { ItemColor } from "../logic/ItemColors";
import { addBetween } from "../logic/Utils";
import { CreateTableSliceState } from "../slices/CreateTableSlice";
import { Block } from "./Block";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { ColumnDefEditor } from "./ColumnDefEditor";
import { Input } from "./Input";
import { Spacer } from "./Spacer";
import { TableConstraintEditor } from "./TableConstraintEditor";

interface CreateTableEditorProps {
  slice: CreateTableSliceState;
  onRemove: () => void;
}

export function CreateTableEditor({ slice, onRemove }: CreateTableEditorProps): JSX.Element | null {
  return (
    <Block
      collapsed={slice.collapsed}
      setCollapsed={slice.setCollapsed}
      name="CREATE TABLE"
      color={ItemColor.CreateTable}
      onRemove={onRemove}
      headerContols={
        <Fragment>
          <Input label="schema" value={slice.schemaName} onChange={slice.setSchemaName} placeholder="schema" />
          <Input label="table" value={slice.tableName} onChange={slice.setTableName} placeholder="table" />
          <Checkbox checked={slice.ifNotExist} onChange={slice.setIfNotExist} label="IF NOT EXIST" />
        </Fragment>
      }
      sections={[
        {
          name: "Columns",
          content: (
            <Fragment>
              {addBetween(
                slice.columnsSlices.map((col) => (
                  <ColumnDefEditor key={col.id} slice={col} onRemove={() => slice.columnsActions.remove(col.id)} />
                )),
                (index) => (
                  <Spacer key={`spacer-${index}`} height={[0, 1]} />
                )
              )}
              {slice.columnsSlices.length > 0 && <Spacer height={[0, 1]} />}
              <Button color={ItemColor.ColumnDef} onClick={() => slice.columnsActions.add()}>
                + Column
              </Button>
            </Fragment>
          ),
        },
        {
          name: "Constraints",
          content: (
            <Fragment>
              {addBetween(
                slice.constraintsSlices.map((constraint) => (
                  <TableConstraintEditor
                    key={constraint.id}
                    slice={constraint}
                    onRemove={() => slice.constraintsActions.remove(constraint.id)}
                  />
                )),
                (index) => (
                  <Spacer key={`spacer-${index}`} height={[0, 1]} />
                )
              )}
              {slice.constraintsSlices.length > 0 && <Spacer height={[0, 1]} />}
              <Button color={ItemColor.TableConstraint} onClick={() => slice.constraintsActions.add()}>
                + Constraint
              </Button>
            </Fragment>
          ),
        },
      ]}
    />
  );
}
