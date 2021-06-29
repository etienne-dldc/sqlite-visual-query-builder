import { Minus, Plus } from "phosphor-react";
import React, { Fragment } from "react";
import styled from "styled-components";
import { grid } from "../logic/Design";
import { addBetween } from "../logic/Utils";
import {
  ColumnSliceState,
  CreateTableSliceState,
  DataType,
  DATA_TYPE,
} from "../slices/CreateTableSlice";
import { Block } from "./Block";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Select } from "./Select";
import { Spacer } from "./Spacer";

interface CreateTableEditorProps {
  slice: CreateTableSliceState;
  onRemove: () => void;
}

export function CreateTableEditor({
  slice,
  onRemove,
}: CreateTableEditorProps): JSX.Element | null {
  return (
    <Block
      collapsed={slice.collapsed}
      setCollapsed={slice.setCollapsed}
      name="CREATE TABLE"
      color="blue"
      onRemove={onRemove}
      headerContols={
        <Fragment>
          <Input
            value={slice.tableName}
            onChange={slice.setTableName}
            placeholder="Table name"
          />
          <Checkbox
            checked={slice.ifNotExist}
            onChange={slice.setIfNotExist}
            label="IF NOT EXIST"
          />
        </Fragment>
      }
      sections={[
        {
          name: "Columns",
          content: (
            <Fragment>
              {addBetween(
                slice.columnsSlices.map((col) => (
                  <ColumnEditor
                    key={col.id}
                    slice={col}
                    onRemove={() => slice.removeColumn(col.id)}
                  />
                )),
                (index) => (
                  <Spacer key={`spacer-${index}`} height={[0, 1]} />
                )
              )}
              {slice.columnsSlices.length > 0 && <Spacer height={[0, 1]} />}
              <Button color="green" onClick={() => slice.addColumn()}>
                + Column
              </Button>
            </Fragment>
          ),
        },
      ]}
    />
  );
}

type ColumnEditorProps = {
  slice: ColumnSliceState;
  onRemove: () => void;
};

function ColumnEditor({ onRemove, slice }: ColumnEditorProps): JSX.Element {
  return (
    <Block
      collapsed={slice.collapsed}
      setCollapsed={slice.setCollapsed}
      name="Column"
      color="green"
      onRemove={onRemove}
      headerContols={
        <Fragment>
          <Input
            value={slice.name}
            onChange={slice.setName}
            placeholder="Column name"
          />
          <Select<DataType>
            value={slice.dataType}
            options={DATA_TYPE}
            onChange={slice.setDataType}
          />
          <Checkbox
            checked={slice.notNull}
            onChange={slice.setNotNull}
            label="NOT NULL"
          />
          <Checkbox
            checked={slice.primary}
            onChange={slice.setPrimary}
            label="PRIMARY"
          />
          <Checkbox
            checked={slice.unique}
            onChange={slice.setUnique}
            label="UNIQUE"
          />
          <Checkbox
            checked={slice.references}
            onChange={slice.setReferences}
            label="REFERENCES"
          />
        </Fragment>
      }
      sections={[
        slice.references && {
          name: "REFERENCES",
          content: (
            <ReferencesWrapper>
              <Input
                value={slice.foreignTable}
                onChange={slice.setForeignTable}
                placeholder="Foreign Table"
                colored
                width={200}
              />
              {slice.foreignColumns.map((col, index) => (
                <Input
                  colored
                  key={index}
                  value={col}
                  onChange={(val) => slice.setForeignColumn(index, val)}
                  placeholder="Foreign Column"
                  width={150}
                />
              ))}
              {slice.foreignColumns.length > 1 && (
                <Button onClick={slice.removeForeignColumn} icon={<Minus />} />
              )}
              <Button onClick={slice.addForeignColumn} icon={<Plus />} />
            </ReferencesWrapper>
          ),
        },
      ]}
    />
  );
}

const ReferencesWrapper = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: grid(0, 1),
  flexWrap: "wrap",
});
