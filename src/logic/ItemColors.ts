import { ColorName } from "./Design";

function color(val: ColorName): ColorName {
  return val;
}

export const ItemColor = {
  ColumnDef: color("green"),
  CreateTable: color("blue"),
  TableConstraint: color("red"),
  Select: color("purple"),
} as const;
