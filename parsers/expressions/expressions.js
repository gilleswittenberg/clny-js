const {
  choice
} = require("arcsecond")

const {
  spaces
} = require("../convenience/whitespace")

const nullParser = require("./scalars/null")
const boolean = require("./scalars/boolean")
const number = require("./scalars/number")
const string = require("./scalars/string")
const identity = require("./identity")

const keyPrefix = require("../keyPrefix")
const keyPostfix = require("../keyPostfix")

const createPrecedenceParser = require("../createPrecedenceParser")

const Assignment = require("../../tree/expressions/Assignment")
const Operation = require("../../tree/expressions/operations/Operation")
const Application = require("../../tree/expressions/scopes/Application")
const Property = require("../../tree/expressions/Property")
const FunctionType = require("../../tree/FunctionType")
const Expression = require("../../tree/expressions/Expression")

const { typeLiteral: type } = require("../types/type")

const notOperator = operator => expression => expression !== operator

// scalar
const basic = choice([
  nullParser,
  boolean,
  number,
  string,
  identity,
  type
])

// @TODO: Merge mapPostfixToApplication, mapToApplication
const mapPostfixToApplication = matches => {
  const evaluate = (operator, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Application(expression)
  }
  return evaluate(...matches)
}

const mapToApplication = matches => {
  const evaluate = (operator, arrayOrFunc, expression) => {
    const func = Array.isArray(arrayOrFunc) ? evaluate(...arrayOrFunc) : arrayOrFunc
    return new Application(func, expression)
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

const mapPrefixToOperation = matches => {
  const evaluate = (operator, arrayOrExpression) => {
    const operand = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Operation("PREFIX", operator, operand)
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

const mapToFunctionType = matches =>
  new FunctionType(matches[1], matches[2])

const mapToExpressions = matches =>
  matches
    .flat(Infinity)
    .filter(notOperator(";"))

const table = [

  // Application
  { type: "POSTFIX", operators: "()", mapTo: mapPostfixToApplication },

  // Properties
  { type: "POSTFIX", operators: keyPostfix, mapTo: mapPostfixToProperty, whitespace: false },

  // Booleans
  { type: "PREFIX", operators: "!", mapTo: mapPrefixToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: "&", mapTo: mapToOperation },
  // Boolean OR, Sum Type
  { type: "LEFT_ASSOCIATIVE", operators: "|", mapTo: mapToOperation },

  // Numbers
  { type: "PREFIX", operators: "-", mapTo: mapPrefixToOperation },
  { type: "RIGHT_ASSOCIATIVE", operators: "**", mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: ["*", "/"], mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: ["+", "-"], mapTo: mapToOperation },

  // Range
  { type: "LEFT_ASSOCIATIVE", operators: ",,", mapTo: mapToOperation },

  // Assignment
  { type: "PREFIX", operators: keyPrefix, mapTo: mapToAssignment },

  // Plurals
  { type: "LEFT_ASSOCIATIVE", operators: ",", mapTo: mapToPlural },

  // Function Type
  { type: "LEFT_ASSOCIATIVE", operators: "->", mapTo: mapToFunctionType },

  // Application by space
  { type: "LEFT_ASSOCIATIVE", operators: spaces, mapTo: mapToApplication, whitespace: false },

  // Scope
  { type: "LEFT_ASSOCIATIVE", operators: ";", mapTo: mapToExpressions }
]

const parser = createPrecedenceParser(table, basic)

module.exports = parser
