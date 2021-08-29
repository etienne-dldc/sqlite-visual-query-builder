import { TokenStream } from "../core/TokenStream";
import { ParserUtils } from "./ParserUtils";
import { TokenIs } from "../core/Token";
import { DataTypeInternal, DataTypeUtils } from "../DataType";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function DataTypeParser(input: TokenStream) {
  const { unexpected, isPunctuation, skipPunctuation, parseInteger } = ParserUtils(input);

  return {
    parseDataType,
  };

  function parseDataType(): DataTypeInternal {
    const tok = input.maybePeek();
    if (tok === null) {
      return unexpected(`Expected an data type identifier`);
    }
    if (!TokenIs.Identifier(tok)) {
      return unexpected(`Expected an data type identifier`);
    }
    const dt = tok.value.toUpperCase();
    input.next();
    if (DataTypeUtils.typeIs(dt, ["BLOB", "INTEGER", "NULL", "NUMERIC", "REAL", "TEXT"] as const)) {
      return DataTypeUtils.create(dt, {});
    }
    // if (
    //   DataTypeUtils.typeIs(dt, [
    //     'CHAR',
    //     'CHARACTER',
    //     'VARCHAR',
    //     'TIME',
    //     'TIMESTAMP',
    //     'TIMESTAMPTZ',
    //     'INTERVAL',
    //   ] as const)
    // ) {
    //   const param = parseMaybeIntParam();
    //   return DataTypeUtils.create(dt, { param });
    // }
    // if (DataTypeUtils.typeIs(dt, ['NUMERIC', 'DECIMAL'] as const)) {
    //   return DataTypeUtils.create(dt, { params: parseMaybeNumericParams() });
    // }
    return unexpected(`Unknow DataType ${dt}`);
  }

  // function parseMaybeIntParam(): number | null {
  //   if (isPunctuation("(")) {
  //     skipPunctuation("(");
  //     const val = parseInteger();
  //     skipPunctuation(")");
  //     return val;
  //   }
  //   return null;
  // }

  // function parseMaybeNumericParams(): null | { p: number; s: number } {
  //   if (isPunctuation("(")) {
  //     skipPunctuation("(");
  //     const p = parseInteger();
  //     skipPunctuation(",");
  //     const s = parseInteger();
  //     skipPunctuation(")");
  //     return { p, s };
  //   }
  //   return null;
  // }
}
