import { createStore } from "democrat";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { grid } from "../logic/Design";
import { addBetween, expectNever } from "../logic/Utils";
import { RootSliceState } from "../slices/RootSlice";
import { Button } from "./Button";
import { CreateTableEditor } from "./CreateTableEditor";
import { SelectEditor } from "./SelectEditor";
import { Spacer } from "./Spacer";

interface EditorProps {
  state: RootSliceState;
}

export function Editor({ state }: EditorProps): JSX.Element | null {
  return (
    <Wrapper>
      {addBetween(
        state.statementsSlices.map((slice) => {
          if (slice.type === "CreateTable") {
            return (
              <CreateTableEditor
                key={slice.id}
                slice={slice}
                onRemove={() => state.removeStatement(slice.id)}
              />
            );
          }
          if (slice.type === "Select") {
            return (
              <SelectEditor
                key={slice.id}
                slice={slice}
                onRemove={() => state.removeStatement(slice.id)}
              />
            );
          }
          expectNever(slice);
        }),
        (index) => (
          <Spacer key={`spacer-${index}`} height={[0, 1]} />
        )
      )}
      {state.statementsSlices.length > 0 && <Spacer height={[0, 1]} />}
      <Buttons>
        <Button color="blue" onClick={() => state.addStatement("CreateTable")}>
          + Create Table
        </Button>
        <Spacer width={[0, 1]} />
        <Button color="purple" onClick={() => state.addStatement("Select")}>
          + Select
        </Button>
      </Buttons>
    </Wrapper>
  );
}

const Wrapper = styled.div({
  padding: grid(0, 1),
});

const Buttons = styled.div({
  display: "flex",
  flexDirection: "row",
});
