import { CSSProperties, memo, RefObject, useMemo, useRef } from "react";
import styled from "styled-components";
import Scrollbar from "react-scrollbars-custom";
import { useElementSize } from "../logic/useElementSize";
import React from "react";

type Direction = "vertical" | "horizontal" | "both";

type Props = {
  children: React.ReactNode | null;
  direction?: Direction;
  justifyContent?: "center" | "flex-start";
  scrollRef?: RefObject<Scrollbar | null>;
};

export const ScrollFlex = memo(function ScrollFlex({
  children,
  direction = "vertical",
  justifyContent = "flex-start",
  scrollRef,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const size = useElementSize(contentRef);

  const innerStyle = useMemo((): CSSProperties => {
    const styles: CSSProperties = {
      minWidth: size.width || 100,
      minHeight: size.height || 100,
      justifyContent,
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    };
    if (direction === "vertical") {
      styles.width = size.width;
    }
    if (direction === "horizontal") {
      styles.height = size.height;
    }
    return styles;
  }, [direction, justifyContent, size.height, size.width]);

  return (
    <Content ref={contentRef}>
      <Scrollbar
        noScrollX={direction === "vertical"}
        noScrollY={direction === "horizontal"}
        style={{ width: size.width, height: size.height, position: "relative" }}
        ref={scrollRef as any}
        disableTracksWidthCompensation={true}
      >
        <div style={innerStyle}>{children}</div>
      </Scrollbar>
    </Content>
  );
});

const Content = styled.div({
  flex: 1,
  position: "relative",
  minWidth: 1,
  minHeight: 1,
  alignSelf: "stretch",
});
