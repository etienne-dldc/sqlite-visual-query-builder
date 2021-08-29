import { Cursor } from "./Cursor";

export interface InputStream {
  next(): string;
  peek(): string;
  eof(): boolean;
  croak(msg: string): never;
  cursor(): Cursor;
}

export function InputStream(input: string): InputStream {
  let pos = 0;
  let line = 1;
  let col = 0;

  return {
    next,
    peek,
    eof,
    croak,
    cursor,
  };

  function cursor(): Cursor {
    return {
      line,
      column: col,
    };
  }

  function next(): string {
    const ch = input.charAt(pos++);
    if (ch === "\n") {
      line++;
      col = 0;
    } else {
      col++;
    }
    return ch;
  }

  function peek(): string {
    return input.charAt(pos);
  }

  function eof(): boolean {
    return peek() == "";
  }

  function croak(msg: string): never {
    throw new Error(msg + " (" + line + ":" + col + ")");
  }
}
