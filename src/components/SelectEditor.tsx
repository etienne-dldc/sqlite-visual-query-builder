import React from "react";
import { SelectSliceState } from "../slices/SelectSlice";
import { Block } from "./Block";

interface SelectEditorProps {
  slice: SelectSliceState;
  onRemove: () => void;
}

export function SelectEditor({
  slice,
  onRemove,
}: SelectEditorProps): JSX.Element | null {
  return (
    <Block
      collapsed={slice.collapsed}
      setCollapsed={slice.setCollapsed}
      onRemove={onRemove}
      name="SELECT"
      color="purple"
    />
  );
}
