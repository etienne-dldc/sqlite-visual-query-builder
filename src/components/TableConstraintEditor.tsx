import { Minus, Plus } from "phosphor-react";
import React, { Fragment } from "react";
import { ItemColor } from "../logic/ItemColors";
import { TableConstraintSliceState, TABLE_CONSTRAINT_TYPE } from "../slices/TableConstraintSlice";
import { Block } from "./Block";
import { Button } from "./Button";
import { Inline } from "./Inline";
import { Input } from "./Input";
import { MultiInputs } from "./MultiInputs";
import { Select } from "./Select";

type Props = {
  slice: TableConstraintSliceState;
  onRemove: () => void;
};

export function TableConstraintEditor({ onRemove, slice }: Props): JSX.Element | null {
  return (
    <Block
      name="Constraint"
      onRemove={onRemove}
      collapsed={slice.collapsed}
      setCollapsed={slice.setCollapsed}
      color={ItemColor.TableConstraint}
      headerContols={
        <Fragment>
          <Input label="name" value={slice.name} onChange={slice.setName} placeholder="name" />
          <Select
            label="constraint type"
            value={slice.constraintType}
            onChange={slice.setConstraintType}
            options={TABLE_CONSTRAINT_TYPE}
          />
        </Fragment>
      }
      sections={[
        slice.constraintType === "PRIMARY KEY" && {
          name: "PRIMARY KEY COLUMNS",
          content: (
            <Inline>
              <MultiInputs values={slice.primaryColumns} actions={slice.primaryColumnsActions} />
            </Inline>
          ),
        },
        slice.constraintType === "UNIQUE" && {
          name: "UNIQUE COLUMNS",
          content: (
            <Inline>
              <MultiInputs values={slice.uniqueColumns} actions={slice.uniqueColumnsActions} />
            </Inline>
          ),
        },
        slice.constraintType === "CHECK" && {
          name: "CHECK EXPRESSION",
          content: (
            <Inline>
              <Input width={200} colored label="Expression" value={slice.checkExpr} onChange={slice.setCheckExpr} />
            </Inline>
          ),
        },
        slice.constraintType === "FOREIGN KEY" && {
          name: "FOREIGN COLUMNS",
          content: (
            <Inline>
              <MultiInputs values={slice.foreignColumns} actions={slice.foreignColumnsActions} />
            </Inline>
          ),
        },
      ]}
    />
  );
}
