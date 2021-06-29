import React, { useState } from "react";
import styled from "styled-components";
import { fontHeightGrid, Fonts, grid, Colors } from "../logic/Design";
import { nanoid } from "nanoid";

type Props<T extends string> = {
  options: ReadonlyArray<T> | Array<T> | Array<{ value: T; label: string }>;
  value: T;
  onChange: (val: T) => void;
  label?: React.ReactNode | null;
  colored?: boolean;
};

export function Select<T extends string>({
  options,
  value,
  onChange,
  label = null,
  colored = false,
}: Props<T>): JSX.Element | null {
  const [id] = useState(() => nanoid(6));

  const select = (
    <SelectStyled
      inputColored={colored}
      value={value}
      onChange={(e) => {
        onChange(e.currentTarget.value as any);
      }}
      id={id}
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

  if (label === null) {
    return select;
  }
  return (
    <Wrapper inputColored={colored}>
      <Label htmlFor={id}>{label}</Label>
      {select}
    </Wrapper>
  );
}

const Label = styled.label({
  whiteSpace: "nowrap",
  ...fontHeightGrid(0, 1, 1, 1),
  ...Fonts.SpaceGrotesk.Regular,
  textTransform: "uppercase",
  paddingLeft: grid(0, 0, 1, 1),
  paddingRight: grid(0, 0, 1, 1),
});

const Wrapper = styled.div(
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: grid(0, 0, 0, 1),
    color: Colors.blueGrey(800),
  },
  ({ inputColored = false }: { inputColored?: boolean }) => ({
    background: inputColored ? Colors.blueGrey(100) : Colors.blueGrey(50),
  })
);

const SelectStyled = styled.select(
  {
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
  },
  ({ inputColored = false }: { inputColored?: boolean }) => ({
    background: inputColored ? Colors.blueGrey(50) : Colors.white,
  })
);
