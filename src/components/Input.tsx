import styled from "styled-components";
import { fontHeightGrid, Fonts, grid, Colors } from "../logic/Design";

import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  colored?: boolean;
  width?: number;
};

export function Input({
  onChange,
  value,
  placeholder,
  colored = false,
  width = 100,
}: Props): JSX.Element | null {
  return (
    <InputStyled
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.currentTarget.value)}
      inputColored={colored}
      style={{ width }}
    />
  );
}

const InputStyled = styled.input(
  {
    ...fontHeightGrid(1),
    ...Fonts.SpaceGrotesk.SemiBold,
    textTransform: "none",
    textDecoration: "none",
    margin: 0,
    paddingLeft: grid(0, 0, 1),
    paddingRight: grid(0, 0, 1),
    paddingBottom: grid(0, 0, 0, 1),
    paddingTop: grid(0, 0, 0, 1),
    border: "none",
    borderRadius: grid(0, 0, 0, 1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.blueGrey(900),
  },
  ({ inputColored = false }: { inputColored?: boolean }) => ({
    background: inputColored ? Colors.blueGrey(50) : Colors.white,
  })
);
