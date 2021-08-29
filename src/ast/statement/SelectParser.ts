import {
  Expression,
  Identifier,
  Select,
  TableExpression,
  SelectColumns,
  SelectColumnsItem,
  FromExpression,
  Column,
  Table,
  TableAlias,
  LeftJoin,
} from '@zensql/ast';
import { TokenStream } from '../core/TokenStream';
import { ParserUtils } from '../utils/ParserUtils';
import { ExpressionParser } from '../utils/ExpressionParser';

export function SelectParser(input: TokenStream) {
  const {
    skipComment,
    isStar,
    skipStar,
    isKeyword,
    unexpected,
    parseMultiple,
    skipKeyword,
    parseIdentifier,
    isPunctuation,
    skipPunctuation,
    parseTable,
    createNode,
  } = ParserUtils(input);
  const { parseExpression } = ExpressionParser(input);

  return {
    parseSelect,
  };

  function parseSelect(): Select {
    skipKeyword('SELECT');
    const columns = parseSelectColumns();
    const fromExpression = parseFromExpression();
    return createNode('Select', {
      columns,
      from: fromExpression,
    });
  }

  function parseSelectColumns(): SelectColumns {
    skipComment();
    const items = parseMultiple(',', parseSelectColumnsItem);
    skipComment();
    if (items.length === 0) {
      return unexpected(`Expected at least one item in SELECT`);
    }
    return items;
  }

  function parseFromExpression(): FromExpression {
    skipComment();
    if (!isKeyword('FROM')) {
      return unexpected('Missing FROM statement');
    }
    skipKeyword('FROM');
    const tables = parseMultiple(',', parseFromExpressionTable);
    skipComment();
    const where = parseWhereExpression();
    if (tables.length === 0) {
      return unexpected(`Expecting at least one item in WHERE`);
    }
    return createNode('FromExpression', {
      tables,
      where,
      // TODO: parse LIMIT
      limit: null,
    });
  }

  function parseWhereExpression(): null | Expression {
    skipComment();
    if (!isKeyword('WHERE')) {
      return null;
    }
    skipKeyword('WHERE');
    return parseExpression();
  }

  function parseSelectColumnsItem(): SelectColumnsItem {
    skipComment();
    if (isStar()) {
      skipStar();
      return createNode('ColumnAll', {});
    }
    const column = parseColumn();
    if (column.schema === null && isStar()) {
      skipStar();
      return createNode('ColumnAllFromTable', {
        schema: column.table,
        table: column.column,
      });
    }
    if (isKeyword('AS')) {
      skipKeyword('AS');
      const alias = parseIdentifier(false);
      return createNode('ColumnAlias', {
        alias,
        schema: column.schema,
        table: column.table,
        column: column.column,
      });
    }
    return column;
  }

  function parseColumn(): Column {
    const first = parseIdentifier(false);
    let second: Identifier | null = null;
    let third: Identifier | null = null;
    if (isPunctuation('.')) {
      skipPunctuation('.');
      if (isStar() === false) {
        second = parseIdentifier(true);
        if (isPunctuation('.')) {
          skipPunctuation('.');
          if (isStar() === false) {
            third = parseIdentifier(true);
          }
        }
      }
    }
    const [schema, table, column] = third
      ? [first, second, third]
      : second
      ? [null, first, second]
      : [null, null, first];
    return createNode('Column', {
      schema,
      table,
      column,
    });
  }

  function parseFromExpressionTable(): TableExpression {
    skipComment();
    let table: TableExpression = parseTableOrTableAlias();
    while (isKeyword('LEFT')) {
      skipKeyword('LEFT');
      skipKeyword('JOIN');
      const right = parseTableOrTableAlias();
      skipKeyword('ON');
      const condition = parseExpression();
      const join: LeftJoin = createNode('LeftJoin', {
        left: table,
        condition,
        right,
      });
      table = join;
    }
    return table;
  }

  function parseTableOrTableAlias(): Table | TableAlias {
    const table = parseTable();
    if (isKeyword('AS')) {
      skipKeyword('AS');
      return createNode('TableAlias', {
        table,
        alias: parseIdentifier(true),
      });
    }
    return table;
  }
}
