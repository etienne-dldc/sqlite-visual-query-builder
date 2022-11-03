import React, { useEffect, useRef, useState } from "react";
import SplitPaneBase, { SplitPaneProps } from "react-split-pane";
import styled from "styled-components";
import { Editor } from "./Editor";
import { Preview } from "./Preview";
import { createStore, Snapshot, Store } from "democrat";
import { RootSlice, RootSliceState } from "../slices/RootSlice";
import { ScrollFlex } from "./ScrollFlex";
import { Spacer } from "./Spacer";
import { Colors, fontHeightGrid, Fonts, grid } from "../logic/Design";
import { Code, Heart, TwitterLogo } from "phosphor-react";

const SplitPane = SplitPaneBase as React.ComponentType<React.PropsWithChildren<SplitPaneProps>>;

export function App(): JSX.Element | null {
  const [state, setState] = useState<RootSliceState | null>(null);

  useEffect(() => {
    const snap: Snapshot | undefined = (window as any).snapshot;
    const store = createStore(RootSlice.createElement(), { ReactInstance: React, snapshot: snap });
    setState(store.getState());
    const unsub = store.subscribe(() => {
      setState(store.getState());
    });
    return () => {
      const snap = store.getSnapshot();
      (window as any).snapshot = snap;
      unsub();
      store.destroy();
    };
  }, []);

  return (
    <Wrapper>
      <SplitPane
        split="vertical"
        defaultSize="50%"
        pane2Style={{
          overflow: "hidden",
        }}
      >
        <Pane>
          <ScrollFlex>
            <EditorWrapper>{state && <Editor state={state} />}</EditorWrapper>
            <Spacer height={[1]} />
            <Credits>
              <CreditsText>
                Made with <Heart weight="fill" color={Colors.red(500)} size={grid(1)} style={{ marginBottom: -7 }} /> by{" "}
                <a href="https://dldc.dev/twitter">
                  <TwitterLogo weight="fill" color="#1DA1F2" size={grid(1)} style={{ marginBottom: -7 }} /> @EtienneTech
                </a>
              </CreditsText>
              <Spacer height={[0, 0, 1]} />
              <CreditsText>
                Explore the{" "}
                <a href="https://github.com/etienne-dldc/sqlite-visual-query-builder">
                  <Code weight="fill" color={Colors.blueGrey(900)} size={grid(1)} style={{ marginBottom: -7 }} /> Code
                  on Github
                </a>
              </CreditsText>
            </Credits>
            <Spacer height={[1]} />
          </ScrollFlex>
        </Pane>
        <Preview content={state ? state.sql : ""} />
      </SplitPane>
    </Wrapper>
  );
}

const Pane = styled.div({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  display: "flex",
});

const Wrapper = styled.div({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const EditorWrapper = styled.div({
  minHeight: `calc(100vh - ${grid(6)}px)`,
});

const Credits = styled.footer({
  height: grid(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  background: Colors.blueGrey(50),
  borderRadius: grid(0, 1),
  marginLeft: grid(1),
  marginRight: grid(1),
});

const CreditsText = styled.p({
  ...Fonts.SpaceGrotesk.DemiBold,
  ...fontHeightGrid(1),
  textAlign: "center",
  color: Colors.blueGrey(900),
  verticalAlign: "middle",
});
