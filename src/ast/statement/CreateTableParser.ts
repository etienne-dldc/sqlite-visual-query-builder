import { TokenStream } from '../core/TokenStream';
import {
  Identifier,
  Constraint,
  TableConstraint,
  CreateTableStatement,
  ColumnDef,
  PrimaryKeyTableConstraint,
  UniqueConstraint,
  NotNullConstraint,
  PrimaryKeyConstraint,
  ReferenceConstraint,
} from '@zensql/ast';
import { ParserUtils } from '../utils/ParserUtils';
import { DataTypeParser } from '../utils/DataTypeParser';

export function CreateTableParser(input: TokenStream) {
  const {
    skipKeyword,
    parseIdentifier,
    isPunctuation,
    skipPunctuation,
    parseMultiple,
    skipComment,
    isKeyword,
    parseTable,
    createNode,
  } = ParserUtils(input);
  const { parseDataType } = DataTypeParser(input);

  return {
    parseCreateStatement,
  };

  function parseCreateStatement(): CreateTableStatement {
    skipKeyword('CREATE');
    skipKeyword('TABLE');
    const table = parseTable();
    skipPunctuation('(');
    const items = parseMultiple(',', parseCreateItem);
    skipPunctuation(')');
    return createNode('CreateTableStatement', { table, items });
  }

  function parseCreateItem(): ColumnDef | TableConstraint {
    skipComment();
    const constraint = parseMaybeTableConstraint();
    if (constraint) {
      return constraint;
    }
    return parseColumnDef();
  }

  function parseMaybeTableConstraint(): TableConstraint | null {
    return parseMaybePrimaryKeyTableConstraint();
  }

  function parseMaybePrimaryKeyTableConstraint(): PrimaryKeyTableConstraint | null {
    if (isKeyword('PRIMARY')) {
      skipKeyword('PRIMARY');
      skipKeyword('KEY');
      skipPunctuation('(');
      const columns = parseMultiple(',', () => parseIdentifier(false));
      skipPunctuation(')');
      return createNode('PrimaryKeyTableConstraint', { columns });
    }
    return null;
  }

  function parseColumnDef(): ColumnDef {
    skipComment();
    const name = parseIdentifier(true);
    const dt = parseDataType();
    const constraints = parseConstraints();

    return createNode('ColumnDef', {
      dataType: createNode('DataType', { dt, tsType: null }),
      name,
      constraints,
    });
  }

  function parseConstraints(): Array<Constraint> {
    const result: Array<Constraint> = [];
    let next = parseConstraint();
    while (!input.eof() && next) {
      result.push(next);
      next = parseConstraint();
    }
    return result;
  }

  function parseConstraint(): Constraint | null {
    return (
      parseMaybeNotNull() || parseMaybePrimaryKey() || parseMaybeUnique() || parseMaybeReference()
    );
  }

  function parseMaybeUnique(): UniqueConstraint | null {
    if (isKeyword('UNIQUE')) {
      skipKeyword('UNIQUE');
      return createNode('UniqueConstraint', {});
    }
    return null;
  }

  function parseMaybeNotNull(): NotNullConstraint | null {
    if (isKeyword('NOT')) {
      skipKeyword('NOT');
      skipKeyword('NULL');
      return createNode('NotNullConstraint', {});
    }
    return null;
  }

  function parseMaybePrimaryKey(): PrimaryKeyConstraint | null {
    if (isKeyword('PRIMARY')) {
      skipKeyword('PRIMARY');
      skipKeyword('KEY');
      return createNode('PrimaryKeyConstraint', {});
    }
    return null;
  }

  function parseMaybeReference(): ReferenceConstraint | null {
    if (!isKeyword('REFERENCES')) {
      return null;
    }
    skipKeyword('REFERENCES');
    const first = parseIdentifier(false);
    let second: Identifier | null = null;
    if (isPunctuation('.')) {
      skipPunctuation('.');
      second = parseIdentifier(true);
    }
    skipPunctuation('(');
    const column = parseIdentifier(false);
    skipPunctuation(')');

    const [schema, table] = second ? [first, second] : [null, first];
    const foreignKey = createNode('Column', {
      schema,
      table,
      column,
    });
    return createNode('ReferenceConstraint', { foreignKey });
  }
}
