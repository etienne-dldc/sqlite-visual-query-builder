import { TokenStream } from "../core/TokenStream";
import { TokenIs, TokenPunctuation, TokenStar, TokenIdentifier, Token } from "../core/Token";
import { Keyword, Keywords } from "../Keyword";
import { NodeType, NodesData, NodeInternal, Identifier, Node, Table } from "../Node";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ParserUtils(input: TokenStream) {
  return {
    skipComment,
    skipPunctuation,
    skipKeyword,
    skipStar,
    isStar,
    isKeyword,
    unexpected,
    parseMultiple,
    isKeywordToken,
    isPunctuation,
    parseIdentifier,
    parseInteger,
    parseTable,
    createNode,
  };

  function createNode<K extends NodeType>(type: K, data: NodesData[K]): NodeInternal<K> {
    return Node.create(type, data as any, input.cursor());
  }

  function skipComment(): void {
    const next = input.maybePeek();
    if (next && TokenIs.Comment(next)) {
      input.next();
      return skipComment();
    }
  }

  function isPunctuation(ch?: string): false | TokenPunctuation {
    const tok = input.maybePeek();
    return tok !== null && TokenIs.Punctuation(tok) && (!ch || tok.value == ch) && tok;
  }

  function isStar(): false | TokenStar {
    const tok = input.maybePeek();
    return tok !== null && TokenIs.Star(tok) && tok;
  }

  function isKeyword(keyword?: Keyword): false | TokenIdentifier {
    const tok = input.maybePeek();
    return tok !== null && isKeywordToken(tok, keyword) ? tok : false;
  }

  function isKeywordToken(tok: Token, keyword?: Keyword): tok is TokenIdentifier {
    return (
      tok !== null &&
      TokenIs.Identifier(tok) &&
      (keyword ? tok.value.toUpperCase() === keyword : Keywords.isKeyword(tok.value.toUpperCase()))
    );
  }

  function skipStar(): void {
    if (isStar()) {
      input.next();
    } else {
      input.croak("Expecting *");
    }
  }

  function skipKeyword(keyword: Keyword): void {
    if (isKeyword(keyword)) {
      input.next();
    } else {
      input.croak('Expecting keywork: "' + keyword + '"');
    }
  }

  function skipPunctuation(ch: string): void {
    if (isPunctuation(ch)) {
      input.next();
    } else {
      input.croak('Expecting punctuation: "' + ch + '"');
    }
  }

  function unexpected(msg: string): never {
    return input.croak(msg);
  }

  function parseMultiple<T>(separator: string, parser: () => T): Array<T> {
    const a: Array<T> = [];
    while (!input.eof()) {
      a.push(parser());
      if (isPunctuation(separator)) {
        skipPunctuation(separator);
      } else {
        break;
      }
    }
    return a;
  }

  function parseInteger(): number {
    const tok = input.next();
    if (!TokenIs.Number(tok)) {
      return unexpected(`Expected an Integer`);
    }
    if (!Number.isInteger(tok.value)) {
      return unexpected(`Expected an integer, got ${tok.value}`);
    }
    return tok.value;
  }

  function parseIdentifier(allowKeyword: boolean): Identifier {
    const next = input.peek();
    if (allowKeyword === false && isKeywordToken(next)) {
      unexpected(`${next.value} is a reserved keyword and cannot be used as an identifier`);
    }
    if (TokenIs.QuotedIdentifier(next)) {
      input.next();
      return createNode("Identifier", {
        value: next.value,
        caseSensitive: true,
        originalValue: next.value,
      });
    }
    if (TokenIs.Identifier(next)) {
      input.next();
      return createNode("Identifier", {
        value: next.value.toLowerCase(),
        originalValue: next.value,
        caseSensitive: false,
      });
    }
    return unexpected(`Expected an Identifier`);
  }

  function parseTable(): Table {
    const first = parseIdentifier(false);
    const second = isPunctuation(".") ? (skipPunctuation("."), parseIdentifier(true)) : null;
    const [schema, table] = second === null ? [null, first] : [first, second];
    return createNode("Table", {
      schema,
      table,
    });
  }
}
