import React, { StrictMode } from "react";
import { createGlobalStyle } from "styled-components";
import { Colors, fontFaces, Fonts } from "../logic/Design";
import { App } from "./App";

const STRICT_MODE_ENABLED = false;

const MaybeStrictMode = STRICT_MODE_ENABLED ? StrictMode : React.Fragment;

const GlobalStyleFonts = createGlobalStyle`${fontFaces}`;

const GlobalStyle = createGlobalStyle({
  "html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video":
    {
      margin: "0",
      padding: "0",
      border: "0",
      verticalAlign: "baseline",
    },
  "article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section": {
    display: "block",
  },
  "blockquote, q": { quotes: "none" },
  "blockquote::before, blockquote::after, q::before, q::after": {
    content: "none",
  },
  a: { color: "inherit" },
  table: { borderCollapse: "collapse", borderSpacing: "0" },
  "*, ::before, ::after": {
    boxSizing: "border-box",
    lineHeight: 1.6,
    WebkitFontSmoothing: "antialiased",
  },
  code: { fontSize: "0.95em" },
  body: {
    minHeight: "100vh",
    overflow: "hidden",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    background: Colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontDisplay: "block",
    ...Fonts.SpaceGrotesk.Regular,
  },
  "a:focus": { outline: `5px auto ${Colors.blue(500)}` },
  "body, input, button, select, option": {
    ...Fonts.SpaceGrotesk.Normal,
    color: Colors.black,
  },
  "h1, h2, h3, h4, h5, h6, strong": {
    ...Fonts.SpaceGrotesk.SemiBold,
  },
  button: {
    padding: 0,
  },
  "::selection": { backgroundColor: Colors.blue(600), color: Colors.white },
  "#root": {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export function Root(): JSX.Element | null {
  return (
    <MaybeStrictMode>
      <GlobalStyleFonts />
      <GlobalStyle />
      <App />
    </MaybeStrictMode>
  );
}
