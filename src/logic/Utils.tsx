import { Factory } from "democrat";
import React from "react";
import { Fragment } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expectNever(_val: never): never {
  throw new Error("Unexpected never");
}

export function addBetween<T>(
  list: Array<T>,
  addItem: (sepIndex: number, before: T, after: T) => T
): Array<T> {
  return list.reduce<Array<T>>((acc, item, index) => {
    if (index > 0) {
      const before = list[index - 1];
      const sep = addItem(index - 1, before, item);
      acc.push(sep);
    }
    acc.push(item);
    return acc;
  }, []);
}

export type FactoryState<F extends Factory<any, any>> = F extends Factory<
  any,
  infer R
>
  ? R
  : never;

export function renderAround(
  before: React.ReactNode | null,
  elem: React.ReactNode | null | undefined,
  after: React.ReactNode | null = null
): React.ReactNode | undefined | null {
  return (
    elem && (
      <Fragment>
        {before}
        {elem}
        {after}
      </Fragment>
    )
  );
}

export function renderAfter(
  elem: React.ReactNode | null | undefined,
  after: React.ReactNode
): React.ReactNode | undefined | null {
  return (
    elem && (
      <Fragment>
        {elem}
        {after}
      </Fragment>
    )
  );
}

export function filterJoin(
  items: Array<string | false | null | undefined>,
  joiner: string
): string {
  return items.filter((v): v is string => typeof v === "string").join(joiner);
}

export function filterDefined<T>(
  items: Array<T | false | null | undefined>
): Array<T> {
  return items.filter(
    (v): v is T => v !== false && v !== null && v !== undefined
  );
}
