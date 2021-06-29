import React, { Fragment } from "react";
import styled from "styled-components";
import { ColorName, Colors, fontHeightGrid, grid } from "../logic/Design";
import { addBetween, filterDefined } from "../logic/Utils";
import { Button } from "./Button";
import { Spacer } from "./Spacer";
import { CaretRight, CaretDown, Trash } from "phosphor-react";

type Props = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  color: ColorName;
  name: string;
  onRemove: () => void;
  headerContols?: React.ReactNode | null;
  sections?: Array<
    | {
        name: string;
        content: React.ReactElement | null;
      }
    | null
    | false
    | undefined
  >;
};

export function Block({
  color,
  name,
  onRemove,
  sections = [],
  headerContols,
  collapsed,
  setCollapsed,
}: Props): JSX.Element | null {
  const sectionsResolved = filterDefined(sections);

  return (
    <Wrapper style={{ background: Colors[color](100) }}>
      <Header>
        <Icon onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <CaretRight weight="bold" color={Colors.blueGrey(900)} size={grid(0, 1, 1)} />
          ) : (
            <CaretDown weight="bold" color={Colors.blueGrey(900)} size={grid(0, 1, 1)} />
          )}
        </Icon>
        <Spacer width={[0, 1]} />
        <HeaderWrap>
          <Title>{name}</Title>
          {!collapsed && headerContols}
        </HeaderWrap>
        <Spacer width={[0, 1]} />
        <Button color={color} colorLevel={500} onClick={onRemove} icon={<Trash />} />
      </Header>
      {!collapsed && (
        <Fragment>
          {sectionsResolved.length > 0 && <Spacer height={[0, 1]} />}
          {addBetween(
            sectionsResolved.map((section, index) => {
              return (
                <div key={index}>
                  <SectionTitle>{section.name}</SectionTitle>
                  <Section>{section.content}</Section>
                </div>
              );
            }),
            (index) => (
              <Spacer key={`spacer-${index}`} height={[0, 1]} />
            )
          )}
        </Fragment>
      )}
    </Wrapper>
  );
}

const Icon = styled.button({
  border: "none",
  width: grid(1, 0, 1),
  height: grid(1, 0, 1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: "none",
});

const Header = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
});

const HeaderWrap = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  gap: grid(0, 1),
  minHeight: grid(1, 0, 1),
});

const Wrapper = styled.div({
  padding: grid(0, 1),
  borderRadius: grid(0, 0, 1),
  overflow: "hidden",
});

const Title = styled.h3({
  textTransform: "uppercase",
  ...fontHeightGrid(1),
});

const Section = styled.div({
  padding: grid(0, 1),
  borderRadius: grid(0, 0, 1),
  overflow: "hidden",
  background: Colors.white,
});

const SectionTitle = styled.h4({
  textTransform: "uppercase",
  margin: 0,
  paddingLeft: grid(0, 0, 1),
  ...fontHeightGrid(0, 1, 1, 1),
});
