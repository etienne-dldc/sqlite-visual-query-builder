import { Minus, Plus } from "phosphor-react";
import React, { Fragment } from "react";
import styled from "styled-components";
import { Colors, fontHeightGrid, grid } from "../logic/Design";
import { ItemColor } from "../logic/ItemColors";
import { ColumnDefSliceState, DataType, DATA_TYPE } from "../slices/ColumnDefSlice";
import { Block } from "./Block";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Inline } from "./Inline";
import { Input } from "./Input";
import { MultiInputs } from "./MultiInputs";
import { Select } from "./Select";
import { Spacer } from "./Spacer";

type ColumnDefEditorProps = {
  slice: ColumnDefSliceState;
  onRemove: () => void;
};

export function ColumnDefEditor({ onRemove, slice }: ColumnDefEditorProps): JSX.Element {
  return (
    <Block
      collapsed={slice.collapsed}
      setCollapsed={slice.setCollapsed}
      name="Column"
      color={ItemColor.ColumnDef}
      onRemove={onRemove}
      headerContols={
        <Fragment>
          <Input label="column" value={slice.name} onChange={slice.setName} placeholder="Column name" />
          <Select<DataType> label="type" value={slice.dataType} options={DATA_TYPE} onChange={slice.setDataType} />
          <Checkbox checked={slice.notNull} onChange={slice.setNotNull} label="NOT NULL" />
          <Checkbox checked={slice.primary} onChange={slice.setPrimary} label="PRIMARY KEY" />
          <Checkbox checked={slice.unique} onChange={slice.setUnique} label="UNIQUE" />
          <Checkbox checked={slice.references} onChange={slice.setReferences} label="REFERENCES" />
        </Fragment>
      }
      sections={[
        slice.references && {
          name: "REFERENCES",
          content: (
            <Fragment>
              <Inline>
                <Input
                  label="Foreign Table"
                  value={slice.foreignTable}
                  onChange={slice.setForeignTable}
                  placeholder="table"
                  colored
                  width={200}
                />
              </Inline>
              <Spacer height={[0, 1]} />
              <Title>Foreign Columns</Title>
              <Inline>
                <MultiInputs values={slice.foreignColumns} actions={slice.foreignColumnsActions} />
              </Inline>
            </Fragment>
          ),
        },
      ]}
    />
  );
}

const Title = styled.h4({
  textTransform: "uppercase",
  margin: 0,
  color: Colors.blueGrey(800),
  ...fontHeightGrid(0, 1, 1, 1),
});
