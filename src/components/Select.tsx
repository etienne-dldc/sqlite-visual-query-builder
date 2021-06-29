import styled from "styled-components";
import { fontHeightGrid, Fonts, grid, Colors } from "../logic/Design";

import React from "react";

type Props<T extends string> = {
  options: ReadonlyArray<T> | Array<T> | Array<{ value: T; label: string }>;
  value: T;
  onChange: (val: T) => void;
};

export function Select<T extends string>({
  options,
  value,
  onChange,
}: Props<T>): JSX.Element | null {
  return (
    <SelectStyled
      value={value}
      onChange={(e) => {
        onChange(e.currentTarget.value as any);
      }}
    >
      {options.map((item) => {
        if (typeof item === "string") {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        }
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </SelectStyled>
  );
}

const SelectStyled = styled.select({
  ...fontHeightGrid(1),
  textTransform: "none",
  textDecoration: "none",
  margin: 0,
  ...Fonts.SpaceGrotesk.SemiBold,
  height: grid(1, 0, 1),
  paddingLeft: grid(0, 0, 1),
  paddingRight: grid(0, 0, 1),
  paddingTop: grid(0, 0, 0, 1),
  paddingBottom: grid(0, 0, 0, 1),
  border: "none",
  borderRadius: grid(0, 0, 0, 1),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: Colors.white,
  color: Colors.blueGrey(900),
  "&:hover": {
    background: Colors.blueGrey(50),
  },
});
