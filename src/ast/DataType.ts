export type DataTypeType = keyof DataTypesData;

export const DataTypeUtils = {
  create: createDataType,
  is: dataTypeIs,
  typeIs: dataTypeTypeIs,
};

function createDataType<K extends keyof DataTypesData>(type: K, data: DataTypesData[K]): AllDataTypes[K] {
  const node: DataTypeInternal<K> = {
    type,
    ...data,
  } as any;
  return node;
}

function dataTypeIs<K extends DataTypeType>(type: K, dataType: DataTypeInternal): dataType is DataTypeInternal<K> {
  return dataType.type === type;
}

function dataTypeTypeIs<T extends ReadonlyArray<DataTypeType>>(
  maybeType: string,
  valids: T
): maybeType is T extends ReadonlyArray<infer U> ? U : never {
  return valids.indexOf(maybeType as any) >= 0;
}

export interface DataTypesData {
  INTEGER: {};
  TEXT: {};
  BLOB: {};
  REAL: {};
  NUMERIC: {};
  NULL: {};
}

export type DataTypeInternal<K extends DataTypeType = DataTypeType> = AllDataTypes[K];

export type AllDataTypes = {
  [K in DataTypeType]: DataTypesData[K] & { type: K };
};

export const DATATYPE = {
  INTEGER: "INTEGER",
  TEXT: "TEXT",
  BLOB: "BLOB",
  REAL: "REAL",
  NUMERIC: "NUMERIC",
  NULL: "NULL",
};

export type DataTypeNameAny = keyof typeof DATATYPE;
