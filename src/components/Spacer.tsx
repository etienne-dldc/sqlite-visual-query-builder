import React from "react";
import { memo } from "react";
import { grid } from "../logic/Design";

type Props = {
  width?: Parameters<typeof grid>;
  height?: Parameters<typeof grid>;
};

export const Spacer = memo<Props>(({ width, height }) => {
  const style: React.CSSProperties = { flexShrink: 0 };
  if (width) {
    style.width = grid(...width);
  }
  if (height) {
    style.height = grid(...height);
  }
  return <div style={style} />;
});
