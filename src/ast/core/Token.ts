interface Tokens {
  Comment: { value: string };
  Math: { value: string };
  NamedVariable: { name: string };
  IndexedVariable: { num: number };
  Operator: { value: string };
  String: { value: string };
  Identifier: { value: string };
  QuotedIdentifier: { value: string };
  Punctuation: { value: string };
  Number: { value: number };
  Star: {};
}

type TokenType = keyof Tokens;

export type Token<K extends TokenType = TokenType> = Tokens[K] & { type: K };

export type TokenVariable = Token<"IndexedVariable" | "NamedVariable">;
export type TokenNumber = Token<"Number">;
export type TokenIdentifier = Token<"Identifier">;
export type TokenQuotedIdentifier = Token<"QuotedIdentifier">;
export type TokenMath = Token<"Math">;
export type TokenString = Token<"String">;
export type TokenStar = Token<"Star">;
export type TokenComment = Token<"Comment">;
export type TokenPunctuation = Token<"Punctuation">;

const TOKENS_OBJ: { [K in TokenType]: null } = {
  Comment: null,
  Math: null,
  IndexedVariable: null,
  NamedVariable: null,
  Operator: null,
  String: null,
  Identifier: null,
  QuotedIdentifier: null,
  Punctuation: null,
  Number: null,
  Star: null,
};

const TOKENS = Object.keys(TOKENS_OBJ) as Array<TokenType>;

export const TokenIs: {
  [K in TokenType]: (token: Token) => token is Token<K>;
} = TOKENS.reduce<any>((acc, key) => {
  acc[key] = (token: Token) => token.type === key;
  return acc;
}, {});

const TOKEN_SERIALIZER: { [K in TokenType]: (token: Token<K>) => string } = {
  Comment: (token) => token.value,
  Identifier: (t) => t.value,
  IndexedVariable: (t) => t.num.toString(),
  Math: (t) => t.value,
  NamedVariable: (t) => t.name,
  Number: (t) => t.value.toString(),
  Operator: (t) => t.value,
  Punctuation: (t) => t.value,
  QuotedIdentifier: (t) => t.value,
  Star: () => "*",
  String: (t) => t.value,
};

export const Token = {
  serialize(token: Token): string {
    return `${token.type}: ${TOKEN_SERIALIZER[token.type](token as any)}`;
  },
};
