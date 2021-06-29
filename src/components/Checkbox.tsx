import styled from "styled-components";
import { fontHeightGrid, Fonts, grid, Colors } from "../logic/Design";

import React from "react";

type Props = {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
};

export function Checkbox({ checked, label, onChange }: Props): JSX.Element | null {
  return (
    <CheckboxStyled>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange(e.currentTarget.checked);
        }}
      />
      {label}
    </CheckboxStyled>
  );
}

const CheckboxStyled = styled.label({
  ...fontHeightGrid(1),
  textTransform: "none",
  textDecoration: "none",
  margin: 0,
  ...Fonts.SpaceGrotesk.SemiBold,
  paddingLeft: grid(0, 0, 0, 1),
  paddingRight: grid(0, 0, 1, 1),
  paddingBottom: grid(0, 0, 0, 1),
  paddingTop: grid(0, 0, 0, 1),
  border: "none",
  borderRadius: grid(0, 0, 0, 1),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: Colors.blueGrey(900),
  background: Colors.white,
  whiteSpace: "nowrap",
  input: {
    width: grid(0, 1, 1),
    height: grid(0, 1, 1),
    position: "relative",
    visibility: "hidden",
    marginRight: grid(0, 0, 1),
    ":before": {
      cursor: "pointer",
      visibility: "visible",
      position: "absolute",
      content: "''",
      display: "block",
      width: grid(0, 1, 1),
      height: grid(0, 1, 1),
      borderRadius: grid(0, 0, 0, 1),
      background: Colors.blueGrey(100),
    },
    ":after": {
      cursor: "pointer",
      visibility: "visible",
      content: "''",
      display: "block",
      opacity: 0,
      position: "absolute",
      margin: grid(0, 0, 0, 1),
      width: grid(0, 1),
      height: grid(0, 1),
      borderRadius: grid(0, 0, 0, 1),
      background: Colors.blueGrey(900),
      transitionDuration: "0.3s",
    },
    ":checked:after": {
      opacity: 1,
    },
  },
});
