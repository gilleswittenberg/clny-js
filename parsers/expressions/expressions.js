const {
  choice
} = require("arcsecond")

const nullParser = require("./scalars/null")
const boolean = require("./scalars/boolean")
const number = require("./scalars/number")
const string = require("./scalars/string")
const identity = require("./identity")

const keyPrefix = require("../keyPrefix")
const keyPostfix = require("../keyPostfix")

const createPrecedenceParser = require("../createPrecedenceParser")

const Expression = require("../../tree/expressions/Expression")
const Assignment = require("../../tree/expressions/Assignment")
const Operation = require("../../tree/expressions/operations/Operation")
const Statement = require("../../tree/expressions/Statement")
const ConditionalStatement = require("../../tree/expressions/ConditionalStatement")
const ForStatement = require("../../tree/expressions/ForStatement")
const Application = require("../../tree/expressions/Application")
const Property = require("../../tree/expressions/Property")

const { functionType, types } = require("../types/type")
const statements = require("../../tree/statements")

const notOperator = operator => expression => expression !== operator

// scalar
const basic = choice([
  nullParser,
  boolean,
  number,
  string,
  identity
])

const mapPrefixToOperation = matches => {
  const evaluate = (operator, arrayOrExpression) => {
    const operand = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Operation("PREFIX", operator, operand)
  }
  return evaluate(...matches)
}

const mapPostfixToApplication = matches => {
  const evaluate = (operator, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Application(expression)
  }
  return evaluate(...matches)
}

const mapPostfixToProperty = matches => {
  const evaluate = (key, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Property(key, expression)
  }
  return evaluate(...matches)
}

const mapToOperation = matches => {
  const evaluate = (operator, arrayOrExpression, arrayOrExpression1) => {
    const operand = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    const operand1 = Array.isArray(arrayOrExpression1) ? evaluate(...arrayOrExpression1) : arrayOrExpression1
    return new Operation("INFIX", operator, operand, operand1)
  }
  return evaluate(...matches)
}

const mapToAssignment = matches => {
  const evaluate = (key, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Assignment(key, expression)
  }
  return evaluate(...matches)
}

const mapToPlural = expressions =>
  new Expression(null, expressions.flat(Infinity).filter(notOperator(",")))

const mapToType = matches => {
  const types = matches.slice(0, -1)
  const expression = matches.slice(-1)[0]
  return types.length > 0 ? types.reduce((acc, type) => expression.setCastToType(type), expression) : expression
}

const mapToStatement = matches => {
  const name = matches[0]
  const expressions = matches.flat(Infinity).slice(1)
  switch (name) {
  case "return":
  case "print":
  case "log":
  case "debug":
    // @TODO: ReturnStatement, PrintStatement
    return new Statement(name, expressions)
  case "if":
  case "elseif":
  case "else":
    return new ConditionalStatement(name, expressions)
  case "for":
    // @TODO: Do not supply name to ForStatement
    return new ForStatement(name, expressions)
  default:
    throw new Error (name + " is not a valid statement name")
  }
}

const mapToExpressions = matches =>
  matches
    .flat(Infinity)
    .filter(notOperator(";"))

const table = [
  { type: "POSTFIX", operators: "()", mapTo: mapPostfixToApplication },
  { type: "POSTFIX", operators: keyPostfix, mapTo: mapPostfixToProperty },
  // Booleans
  { type: "PREFIX", operators: "!", mapTo: mapPrefixToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: "&", mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: "|", mapTo: mapToOperation },
  // Numbers
  { type: "PREFIX", operators: "-", mapTo: mapPrefixToOperation },
  { type: "RIGHT_ASSOCIATIVE", operators: "**", mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: ["*", "/"], mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: ["+", "-"], mapTo: mapToOperation },
  // Type
  // Range
  { type: "LEFT_ASSOCIATIVE", operators: ",,", mapTo: mapToOperation },
  // Assignment
  { type: "PREFIX", operators: types, mapTo: mapToType, whitespaceRequired: true },
  // @TODO: KEYS_VALUE lesser precedence than plural (,)
  { type: "PREFIX", operators: keyPrefix, mapTo: mapToAssignment },
  // @TODO: Combine with types, functionType, key prefixes
  { type: "PREFIX", operators: functionType, mapTo: mapToType, whitespaceRequired: true },
  // Plurals
  { type: "LEFT_ASSOCIATIVE", operators: ",", mapTo: mapToPlural },
  // Statement
  { type: "PREFIX", operators: statements, mapTo: mapToStatement, whitespaceRequired: true },
  // Scope
  { type: "LEFT_ASSOCIATIVE", operators: ";", mapTo: mapToExpressions }
]

const parser = createPrecedenceParser(table, basic)

module.exports = parser
