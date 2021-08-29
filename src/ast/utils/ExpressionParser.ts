import { TokenStream } from "../core/TokenStream";
import { TokenIs, Token } from "../core/Token";
import { ParserUtils } from "./ParserUtils";
import { Expression, Column, Identifier } from "../Node";
import { Operators, ValueOperator, CompareOperator, BooleanOperator } from "../Operator";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ExpressionParser(input: TokenStream) {
  const { isKeyword, unexpected, isKeywordToken, isPunctuation, skipPunctuation, isStar, parseIdentifier, createNode } =
    ParserUtils(input);

  return {
    parseExpression,
  };

  function parseExpression(): Expression {
    return maybeOperation(parseAtom(), 0);
  }

  function maybeOperation(left: Expression, myPrec: number): Expression {
    const tok = input.maybePeek();
    if (tok === null) {
      return left;
    }
    if (TokenIs.Math(tok) || TokenIs.Star(tok)) {
      const valOp = getValueOperator(tok);
      const hisPrec = Operators.getPrecedence(valOp);
      if (hisPrec > myPrec) {
        input.next();
        const nextLeft = createNode("ValueOperation", {
          left,
          operator: valOp,
          right: maybeOperation(parseAtom(), hisPrec),
        });
        return maybeOperation(nextLeft, myPrec);
      }
    }
    if (TokenIs.Operator(tok)) {
      const compOp = getCompareOperator(tok);
      const hisPrec = Operators.getPrecedence(compOp);
      if (hisPrec > myPrec) {
        input.next();
        const nextLeft = createNode("CompareOperation", {
          left,
          operator: compOp,
          right: maybeOperation(parseAtom(), hisPrec),
        });
        return maybeOperation(nextLeft, myPrec);
      }
    }
    if (isKeywordToken(tok, "OR") || isKeywordToken(tok, "AND")) {
      const boolOp = getBoleanOperator(tok);
      const hisPrec = Operators.getPrecedence(boolOp);
      if (hisPrec > myPrec) {
        input.next();
        const nextLeft = createNode("BooleanOperation", {
          left,
          operator: boolOp,
          right: maybeOperation(parseAtom(), hisPrec),
        });
        return maybeOperation(nextLeft, myPrec);
      }
    }
    return left;
  }

  function parseAtom(): Expression {
    if (isPunctuation("(")) {
      input.next();
      const exp = parseExpression();
      skipPunctuation(")");
      return exp;
    }
    if (TokenIs.Identifier(input.peek()) || TokenIs.QuotedIdentifier(input.peek())) {
      return parseColumnExpression();
    }
    if (isKeyword()) {
      return createNode("Null", {});
    }
    const tok = input.next();
    if (TokenIs.NamedVariable(tok)) {
      return createNode("NamedVariable", { name: tok.name });
    }
    if (TokenIs.IndexedVariable(tok)) {
      return createNode("IndexedVariable", { num: tok.num });
    }
    if (TokenIs.Number(tok)) {
      return createNode("Numeric", { value: tok.value });
    }
    if (TokenIs.String(tok)) {
      return createNode("Str", { value: tok.value.toLowerCase() });
    }
    return unexpected(`Expected an Expression`);
  }

  function getValueOperator(tok: Token<"Star" | "Math">): ValueOperator {
    if (TokenIs.Star(tok)) {
      return ValueOperator.Multiply;
    }
    if (TokenIs.Math(tok)) {
      const v = tok.value;
      return v === "+"
        ? ValueOperator.Plus
        : v === "-"
        ? ValueOperator.Minus
        : v === "/"
        ? ValueOperator.Divide
        : v === "%"
        ? ValueOperator.Modulo
        : unexpected(`Invalid Math operator`);
    }
    return unexpected(`Expected an Math operator`);
  }

  function getCompareOperator(tok: Token<"Operator">): CompareOperator {
    if (TokenIs.Operator(tok)) {
      const v = tok.value;
      return v === "="
        ? CompareOperator.Equal
        : v === "<>" || v === "!="
        ? CompareOperator.NotEqual
        : v === "<="
        ? CompareOperator.LessOrEqual
        : v === ">="
        ? CompareOperator.GreaterOrEqual
        : v === "<"
        ? CompareOperator.Less
        : v === ">"
        ? CompareOperator.Greater
        : unexpected(`Invalid compare operator`);
    }
    return unexpected(`Expected a compare operator`);
  }

  function getBoleanOperator(tok: Token<"Identifier">): BooleanOperator {
    if (TokenIs.Identifier(tok)) {
      if (isKeywordToken(tok, "AND")) {
        return BooleanOperator.And;
      }
      if (isKeywordToken(tok, "OR")) {
        return BooleanOperator.Or;
      }
      return unexpected(`Invalid boolean operator`);
    }
    return unexpected(`Expected a boolean operator`);
  }

  function parseColumnExpression(): Column {
    const first = parseIdentifier(false);
    let second: Identifier | null = null;
    let third: Identifier | null = null;
    if (isPunctuation(".")) {
      skipPunctuation(".");
      second = parseIdentifier(true);
      if (isPunctuation(".")) {
        skipPunctuation(".");
        if (isStar() === false) {
          third = parseIdentifier(true);
        }
      }
    }
    const [schema, table, column] = third
      ? [first, second, third]
      : second
      ? [null, first, second]
      : [null, null, first];
    return createNode("Column", {
      schema,
      table,
      column,
    });
  }
}
