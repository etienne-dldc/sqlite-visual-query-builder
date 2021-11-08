import { fontHeightGrid, Fonts, grid, Colors, ColorName } from "../logic/Design";
import styled from "styled-components";
import { IconContext, IconProps } from "phosphor-react";

import React from "react";

type Props = {
  color?: ColorName;
  colorLevel?: number;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const ICON_CONFIG: IconProps = {
  size: grid(1),
  color: "currentColor",
  weight: "regular",
  mirrored: false,
};

export function Button({ children, color = "blue", colorLevel = 100, icon, onClick }: Props): JSX.Element | null {
  return (
    <ButtonStyled buttonColor={color} buttonColorLevel={colorLevel} iconMode={Boolean(icon)} onClick={onClick}>
      <IconContext.Provider value={ICON_CONFIG}>{icon ?? children}</IconContext.Provider>
    </ButtonStyled>
  );
}

const ButtonStyled = styled.button(
  {
    ...fontHeightGrid(1),
    textTransform: "none",
    textDecoration: "none",
    margin: 0,
    ...Fonts.SpaceGrotesk.SemiBold,
    paddingLeft: grid(0, 1),
    paddingRight: grid(0, 1),
    paddingTop: 0,
    paddingBottom: 0,
    border: "none",
    borderRadius: grid(0, 0, 0, 1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderWidth: grid(0, 0, 0, 1),
    borderStyle: "solid",
  },
  ({
    iconMode,
    buttonColor,
    buttonColorLevel,
  }: {
    iconMode: boolean;
    buttonColor: ColorName;
    buttonColorLevel: number;
  }) => ({
    color: buttonColorLevel < 500 ? Colors.blueGrey(900) : Colors.white,
    background: Colors[buttonColor](buttonColorLevel),
    borderColor: Colors[buttonColor](buttonColorLevel),
    "&:hover": {
      background: Colors[buttonColor](buttonColorLevel + 50),
    },
    ...(iconMode && {
      paddingLeft: 0,
      paddingRight: 0,
    }),
  })
);
