/* eslint-disable @typescript-eslint/no-empty-interface */
import { BooleanOperator, CompareOperator, ValueOperator } from './Operator';
import { DataTypeInternal } from './DataType';

export type NodeType = keyof NodesData;

export const Node = {
  create: createNode,
  is: nodeIs,
};

function createNode<K extends keyof NodesData>(
  type: K,
  data: Omit<NodeInternal<K>, 'type' | 'cursor'>,
  cursor?: Cursor
): AllNodes[K] {
  const node: NodeInternal<K> = {
    type,
    ...data,
  } as any;
  if (cursor) {
    node.cursor = cursor;
  }
  return node;
}

function nodeIs<K extends NodeType>(type: K, node: NodeInternal): node is NodeInternal<K> {
  return node.type === type;
}

export interface NodesData {
  // Basics
  Str: { value: string };
  Numeric: { value: number };
  Bool: { value: boolean };
  Null: {};
  Comment: { value: string };

  // Variables
  NamedVariable: { name: string };
  IndexedVariable: { num: number };

  // Identifier
  Identifier: {
    // the value as used by Postgres in lowercase
    value: string;
    originalValue: string;
    caseSensitive: boolean;
  };

  // Expression
  When: {
    condition: Expression;
    then: Term;
  };
  Case: {
    term: Term;
    cases: Array<When>;
    else: Expression | null;
  };
  CaseWhen: {
    cases: Array<When>;
    else: Expression | null;
  };
  BooleanOperation: {
    left: Expression;
    operator: BooleanOperator;
    right: Expression;
  };
  CompareOperation: {
    left: Expression;
    operator: CompareOperator;
    right: Expression;
  };
  ValueOperation: {
    left: Expression;
    operator: ValueOperator;
    right: Expression;
  };

  // Column
  Column: {
    schema: Identifier | null;
    table: Identifier | null;
    column: Identifier;
  };
  ColumnAlias: {
    schema: Identifier | null;
    table: Identifier | null;
    column: Identifier;
    alias: Identifier;
  };
  ColumnAll: {};
  ColumnAllFromTable: { schema: Identifier | null; table: Identifier };

  // Table
  Table: { schema: Identifier | null; table: Identifier };
  TableAlias: {
    table: Table;
    alias: Identifier;
  };

  // Join
  LeftJoin: {
    left: TableExpression;
    right: TableExpression;
    condition: Expression;
  };

  // From
  FromExpression: {
    tables: Array<TableExpression>;
    where: Expression | null;
    limit: Numeric | Variable | null;
  };

  // Constraints
  NotNullConstraint: {};
  PrimaryKeyConstraint: {};
  UniqueConstraint: {};
  ReferenceConstraint: {
    foreignKey: Column;
  };
  PrimaryKeyTableConstraint: {
    columns: Array<Identifier>;
  };
  ReferenceTableConstraint: {
    column: Identifier;
    foreignKey: Column;
  };

  // ColumnDef
  ColumnDef: {
    name: Identifier;
    dataType: DataType;
    constraints: Array<Constraint>;
  };

  // TsTypes
  TsInlineType: {
    typeStr: string;
  };
  TsExternalType: {
    module: string;
    typeName: string;
  };

  // DataTypes
  DataType: {
    dt: DataTypeInternal;
    tsType: TsType | null;
  };

  InserValues: {
    values: Array<Expression>;
  };

  // Alter
  AddConstraint: {
    name: Identifier | null;
    constraint: TableConstraint;
  };

  // Update
  UpdateItem: {
    column: Identifier;
    value: Expression;
  };

  // Statements
  Empty: {};
  Select: {
    columns: SelectColumns;
    from: FromExpression;
  };
  InsertIntoStatement: {
    table: Table | TableAlias;
    columns: Array<Identifier> | null;
    values: Array<InserValues>;
  };
  CreateTableStatement: {
    table: Table;
    items: Array<ColumnDef | TableConstraint>;
  };
  AlterTableStatement: {
    table: Table;
    item: AlterTableItem;
  };
  UpdateStatement: {
    table: Table;
    items: Array<UpdateItem>;
    where: Expression | null;
  };
}

export type Cursor = {
  line: number;
  column: number;
};

export interface NodeCommon {
  cursor?: Cursor;
}

export type AllNodes = {
  [K in NodeType]: NodesData[K] & { type: K } & NodeCommon;
};

export type NodeInternal<K extends NodeType = NodeType> = AllNodes[K];

export type AlterTableStatement = NodeInternal<'AlterTableStatement'>;
export type Bool = NodeInternal<'Bool'>;
export type BooleanOperation = NodeInternal<'BooleanOperation'>;
export type Case = NodeInternal<'Case'>;
export type CaseWhen = NodeInternal<'CaseWhen'>;
export type Column = NodeInternal<'Column'>;
export type ColumnAlias = NodeInternal<'ColumnAlias'>;
export type ColumnAll = NodeInternal<'ColumnAll'>;
export type ColumnAllFromTable = NodeInternal<'ColumnAllFromTable'>;
export type ColumnDef = NodeInternal<'ColumnDef'>;
export type Comment = NodeInternal<'Comment'>;
export type CompareOperation = NodeInternal<'CompareOperation'>;
export type CreateTableStatement = NodeInternal<'CreateTableStatement'>;
export type DataType = NodeInternal<'DataType'>;
export type Empty = NodeInternal<'Empty'>;
export type FromExpression = NodeInternal<'FromExpression'>;
export type Identifier = NodeInternal<'Identifier'>;
export type IndexedVariable = NodeInternal<'IndexedVariable'>;
export type InsertIntoStatement = NodeInternal<'InsertIntoStatement'>;
export type InserValues = NodeInternal<'InserValues'>;
export type LeftJoin = NodeInternal<'LeftJoin'>;
export type NamedVariable = NodeInternal<'NamedVariable'>;
export type NotNullConstraint = NodeInternal<'NotNullConstraint'>;
export type Null = NodeInternal<'Null'>;
export type Numeric = NodeInternal<'Numeric'>;
export type PrimaryKeyConstraint = NodeInternal<'PrimaryKeyConstraint'>;
export type PrimaryKeyTableConstraint = NodeInternal<'PrimaryKeyTableConstraint'>;
export type ReferenceTableConstraint = NodeInternal<'ReferenceTableConstraint'>;
export type ReferenceConstraint = NodeInternal<'ReferenceConstraint'>;
export type Select = NodeInternal<'Select'>;
export type Table = NodeInternal<'Table'>;
export type TableAlias = NodeInternal<'TableAlias'>;
export type UniqueConstraint = NodeInternal<'UniqueConstraint'>;
export type ValueOperation = NodeInternal<'ValueOperation'>;
export type Str = NodeInternal<'Str'>;
export type When = NodeInternal<'When'>;
export type AddConstraint = NodeInternal<'AddConstraint'>;
export type TsInlineType = NodeInternal<'TsInlineType'>;
export type TsExternalType = NodeInternal<'TsExternalType'>;
export type UpdateItem = NodeInternal<'UpdateItem'>;
export type UpdateStatement = NodeInternal<'UpdateStatement'>;

// Alias
export type Value = Identifier | Str | Numeric | Bool | Null;
export type Variable = NamedVariable | IndexedVariable;
export type Term = Value | Variable | Column;
export type BinaryOperation = BooleanOperation | CompareOperation | ValueOperation;
export type Expression = BinaryOperation | Term;
export type TableExpression = TableAlias | Table | LeftJoin;
export type SelectColumnsItem = Column | ColumnAlias | ColumnAll | ColumnAllFromTable;
export type SelectColumns = Array<SelectColumnsItem>;
export type Constraint =
  | NotNullConstraint
  | PrimaryKeyConstraint
  | UniqueConstraint
  | ReferenceConstraint;
export type TableConstraint = PrimaryKeyTableConstraint | ReferenceTableConstraint;
export type Statement = Select | CreateTableStatement | InsertIntoStatement | AlterTableStatement;
export type Statements = Array<Statement>;
export type AlterTableItem = AddConstraint;
export type TsType = TsExternalType | TsInlineType;
