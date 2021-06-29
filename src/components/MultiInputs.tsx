import { Minus, Plus } from "phosphor-react";
import React, { Fragment } from "react";
import { InputListActions } from "../logic/useInputList";
import { Button } from "./Button";
import { Input } from "./Input";

type Props = {
  values: Array<string>;
  actions: InputListActions;
  placeholder?: string;
};

export function MultiInputs({ actions, values, placeholder }: Props): JSX.Element | null {
  return (
    <Fragment>
      {values.map((col, index) => (
        <Input
          label={index}
          colored
          key={index}
          value={col}
          onChange={(val) => actions.set(index, val)}
          placeholder={placeholder}
          width={150}
        />
      ))}
      {values.length > 1 && <Button onClick={actions.remove} icon={<Minus />} />}
      <Button onClick={actions.add} icon={<Plus />} />
    </Fragment>
  );
}
