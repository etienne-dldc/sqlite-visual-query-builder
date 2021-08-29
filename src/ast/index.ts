import { Parser } from './Parser';

export { InputStream } from './core/InputStream';
export { Parser, Result } from './Parser';
export {
  Token,
  TokenComment,
  TokenIdentifier,
  TokenQuotedIdentifier,
  TokenIs,
  TokenMath,
  TokenNumber,
  TokenPunctuation,
  TokenStar,
  TokenString,
  TokenVariable,
} from './core/Token';
export { TokenStream } from './core/TokenStream';

export default Parser;
