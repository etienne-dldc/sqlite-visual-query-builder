import { InputStream } from "./InputStream";
import {
  Token,
  TokenNumber,
  TokenIdentifier,
  TokenQuotedIdentifier,
  TokenMath,
  TokenString,
  TokenStar,
  TokenComment,
} from "./Token";
import { Cursor } from "./Cursor";

const PUNCTUACTIONS = ";(),.";

const OPERATORS = "=<>!";

const MATH = "+-/%";

const DOUBLE_QUOTE = '"';
const SINGLE_QUOTE = "'";

export interface TokenStream {
  next(): Token;
  maybeNext(): Token | null;
  peek(): Token;
  maybePeek(): Token | null;
  eof(): boolean;
  croak(msg: string): never;
  cursor(): Cursor;
}

export function TokenStream(input: InputStream): TokenStream {
  let current: Token | null = null;

  return {
    next,
    maybeNext,
    peek,
    maybePeek,
    eof,
    croak,
    cursor: input.cursor,
  };

  function croak(msg: string): never {
    const isEof = eof();
    const next = maybePeek();
    return input.croak(msg + (isEof ? "" : ` (current is ${next === null ? "null" : Token.serialize(next)}`));
  }

  function maybePeek(): Token | null {
    return current || (current = readNext());
  }

  function peek(): Token {
    const tok = maybePeek();
    if (tok === null) {
      return input.croak("Unexpected EOF (End of File)");
    }
    return tok;
  }

  function maybeNext(): Token | null {
    const tok = current;
    current = null;
    return tok || readNext();
  }

  function next() {
    const tok = maybeNext();
    if (tok === null) {
      return input.croak("Unexpected EOF (End of File)");
    }
    return tok;
  }

  function eof() {
    return maybePeek() == null;
  }

  function readNext(): Token | null {
    readWhile(isWhitespace);
    if (input.eof()) {
      return null;
    }
    const ch = input.peek();
    if (ch === "*") {
      return readStar();
    }
    if (ch === "#") {
      return readLineComment();
    }
    if (ch === SINGLE_QUOTE) {
      return readString();
    }
    if (ch === DOUBLE_QUOTE) {
      return readQuotedIndentifier();
    }
    if (ch === ":") {
      return readNamedVariable();
    }
    if (ch === "$") {
      return readIndexedVariable();
    }
    if (ch === "-") {
      return readMinus();
    }
    if (ch === "/") {
      return readSlash();
    }
    if (isMath(ch)) {
      return readMath();
    }
    if (isDigit(ch)) {
      return readNumber();
    }
    if (isNameStart(ch)) {
      return readIdentifier();
    }
    if (isPunc(ch)) {
      return {
        type: "Punctuation",
        value: input.next(),
      };
    }
    if (isOpChar(ch)) {
      return {
        type: "Operator",
        value: readWhile(isOpChar),
      };
    }
    if (ch === "`") {
      return input.croak(`Backtick are not supported`);
    }
    return input.croak(`Unexpected char: "${ch}"`);
  }

  function isDigit(ch: string): boolean {
    return /[0-9]/i.test(ch);
  }

  function isNameStart(ch: string): boolean {
    return /[a-zA-Z_]/i.test(ch);
  }

  function isNameChar(ch: string): boolean {
    return isNameStart(ch) || "0123456789_".indexOf(ch) >= 0;
  }

  function isOpChar(ch: string): boolean {
    return OPERATORS.indexOf(ch) >= 0;
  }

  function isPunc(ch: string): boolean {
    return PUNCTUACTIONS.indexOf(ch) >= 0;
  }

  function isMath(ch: string): boolean {
    return MATH.indexOf(ch) >= 0;
  }

  function isWhitespace(ch: string): boolean {
    return " \t\n".indexOf(ch) >= 0;
  }

  function readWhile(predicate: (ch: string) => boolean): string {
    let str = "";
    while (!input.eof() && predicate(input.peek())) {
      str += input.next();
    }
    return str;
  }

  function readNamedVariable(): Token<"NamedVariable"> {
    input.next();
    if (isNameStart(input.peek())) {
      const name = readWhile(isNameChar);
      return { type: "NamedVariable", name };
    }
    return input.croak(`Invalid variable name "${input.peek()}"`);
  }

  function readIndexedVariable(): Token<"IndexedVariable"> {
    input.next();
    if (isDigit(input.peek())) {
      const num = parseInt(readWhile(isDigit), 10);
      return { type: "IndexedVariable", num };
    }
    return input.croak(`Invalid variable name "${input.peek()}"`);
  }

  function readNumber(negative = false): TokenNumber {
    let hasDot = false;
    const number = readWhile((ch) => {
      if (ch == ".") {
        if (hasDot) {
          return false;
        }
        hasDot = true;
        return true;
      }
      return isDigit(ch);
    });
    return { type: "Number", value: parseFloat(number) * (negative ? -1 : 1) };
  }

  function readIdentifier(): TokenIdentifier {
    const id = readWhile(isNameChar);
    return {
      type: "Identifier",
      value: id,
    };
  }

  function readMath(): TokenMath {
    return {
      type: "Math",
      value: input.next(),
    };
  }

  function readEscaped(end: string): string {
    let endFound = false;
    let str = "";
    input.next();
    while (!input.eof()) {
      const ch = input.next();
      if (endFound && ch !== end) {
        break;
      }
      if (ch === end) {
        if (endFound) {
          str += end;
          endFound = false;
        } else {
          endFound = true;
        }
      } else {
        str += ch;
      }
    }
    return str;
  }

  function readString(): TokenString {
    return { type: "String", value: readEscaped(SINGLE_QUOTE) };
  }

  function readQuotedIndentifier(): TokenQuotedIdentifier {
    return { type: "QuotedIdentifier", value: readEscaped(DOUBLE_QUOTE) };
  }

  function readStar(): TokenStar {
    input.next();
    return { type: "Star" };
  }

  function readSlash(): TokenComment | TokenMath {
    const slash = input.next() as "/";
    const next = input.peek();
    if (next === "*") {
      input.next();
      return readMultilineComment();
    }
    return {
      type: "Math",
      value: slash,
    };
  }

  function readMinus(): TokenNumber | TokenMath | TokenComment {
    const minus = input.next() as "-";
    const next = input.peek();
    if (next === "-") {
      input.next();
      return readLineComment();
    }
    if (isDigit(next)) {
      return readNumber(true);
    }
    return {
      type: "Math",
      value: minus,
    };
  }

  function readLineComment(): TokenComment {
    const comment = readWhile((ch) => {
      return ch != "\n";
    });
    return {
      type: "Comment",
      value: comment,
    };
  }

  function readMultilineCommentValue(): string {
    const comment = readWhile((ch) => {
      return ch != "*";
    });
    const star = input.next();
    const next = input.peek();
    if (next === "/") {
      input.next();
      return comment;
    }
    return comment + star + readMultilineCommentValue();
  }

  function readMultilineComment(): TokenComment {
    return {
      type: "Comment",
      value: readMultilineCommentValue(),
    };
  }
}
