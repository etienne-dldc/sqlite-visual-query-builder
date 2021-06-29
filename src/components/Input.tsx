import styled from "styled-components";
import { fontHeightGrid, Fonts, grid, Colors } from "../logic/Design";
import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Spacer } from "./Spacer";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  colored?: boolean;
  width?: number;
  label?: React.ReactNode | null;
};

export function Input({
  onChange,
  value,
  placeholder,
  colored = false,
  width = 100,
  label = null,
}: Props): JSX.Element | null {
  const [id] = useState(() => nanoid(6));

  const input = (
    <InputStyled
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.currentTarget.value)}
      inputColored={colored}
      style={{ width }}
    />
  );

  if (label === null) {
    return input;
  }
  return (
    <Wrapper inputColored={colored}>
      <Label htmlFor={id}>{label}</Label>
      {input}
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
