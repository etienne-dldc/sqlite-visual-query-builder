export enum CompareOperator {
  NotEqual = 'NotEqual', // <> | !=
  LessOrEqual = 'LessOrEqual', //<=
  GreaterOrEqual = 'GreaterOfEqual', // >=
  Equal = 'Equal', // =
  Less = 'Less', // <
  Greater = 'Greater', // >
}

export enum ValueOperator {
  Plus = 'Plus', // +
  Minus = 'Minus', // -
  Divide = 'Divide', // /
  Multiply = 'Multiply', // *
  Modulo = 'Modulo', // %
}

export enum BooleanOperator {
  And = 'And',
  Or = 'Or',
}

export type Operator = BooleanOperator | CompareOperator | ValueOperator;

export const Operators = {
  getPrecedence,
};

function getPrecedence(operator: Operator): number {
  // '||': 2,
  // '&&': 3,
  // '<': 7,
  // '>': 7,
  // '<=': 7,
  // '>=': 7,
  // '==': 7,
  // '!=': 7,
  // '+': 10,
  // '-': 10,
  // '*': 20,
  // '/': 20,
  // '%': 20,
  switch (operator) {
    case BooleanOperator.Or:
      return 2;
    case BooleanOperator.And:
      return 3;
    case CompareOperator.Greater:
    case CompareOperator.Less:
    case CompareOperator.GreaterOrEqual:
    case CompareOperator.LessOrEqual:
    case CompareOperator.Equal:
    case CompareOperator.NotEqual:
      return 7;
    case ValueOperator.Plus:
    case ValueOperator.Minus:
      return 10;
    case ValueOperator.Multiply:
    case ValueOperator.Divide:
    case ValueOperator.Modulo:
      return 20;
    default:
      return 39;
  }
}
