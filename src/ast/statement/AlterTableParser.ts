import { TokenStream } from '../core/TokenStream';
import { AlterTableStatement } from '@zensql/ast';
import { ParserUtils } from '../utils/ParserUtils';

export function AlterTableParser(input: TokenStream) {
  const { skipKeyword, createNode, parseTable } = ParserUtils(input);

  return {
    parseAlterTableStatement,
  };

  function parseAlterTableStatement(): AlterTableStatement {
    skipKeyword('ALTER');
    skipKeyword('TABLE');
    const table = parseTable();
    skipKeyword('ADD');
    input.croak('TODO');
    return createNode('AlterTableStatement', {
      table,
      // TODO: fix this
      item: {} as any,
    });
  }
}
