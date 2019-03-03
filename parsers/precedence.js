const {
  choice
} = require("arcsecond")

const nullParser = require("./expressions/null")
const boolean = require("./expressions/booleans/boolean")
const number = require("./expressions/numbers/number")
const string = require("./expressions/strings/string")
const identity = require("./expressions/identity")
const key = require("./scope/key")
//const type = require("./types/type")
const createOperatorsParser = require("./convenience/createOperatorsParser")

const Expression = require("../tree/expressions/Expression")
const Assignment = require("../tree/expressions/Assignment")
const Operation = require("../tree/expressions/operations/Operation")
const Scope = require("../tree/Scope2")

const { types/*, pluralTypes */ } = require("../tree/types2")

const notOperator = operator => expression => expression !== operator

const basic = choice([
  nullParser,
  boolean,
  number,
  string,
  identity
])

const mapPrefixToOperation = expression => {
  const evaluate = expression => {
    const operator = expression[0]
    const snd = expression[1]
    const operand = Array.isArray(snd) ? evaluate(snd) : snd
    return new Operation("PREFIX", operator, operand)
  }
  return evaluate(expression)
}

const mapToOperation = expression => {
  if (expression.length === 1) return expression[0]
  const evaluate = expression => {
    const operator = expression[0]
    const value = expression[1]
    const value1 = expression[2]
    const operand = Array.isArray(value) ? evaluate(value) : value
    const operand1 = Array.isArray(value1) ? evaluate(value1) : value1
    return new Operation("INFIX", operator, operand, operand1)
  }
  return evaluate(expression)
}

const mapToAssignment = matches => {
  const keysAndExpression = matches.filter(notOperator(":"))
  return keysAndExpression.reverse().reduce((acc, cur) => acc == null ? cur : new Assignment([cur], [acc]))
}

const mapToPlural = expressions =>
  new Expression(null, expressions.flat(Infinity).filter(notOperator(",")))

const mapToType = matches => {
  const types = matches.slice(0, -1)
  const expression = matches.slice(-1)[0]
  return types.length > 0 ? types.reduce((acc, type) => expression.castToType(type), expression) : expression
}

const mapToScope = matches =>
  new Scope(
    matches
      .flat(Infinity)
      .filter(notOperator(";"))
  )


const table = [
  // Booleans
  { type: "PRE", operators: ["!"], mapTo: mapPrefixToOperation },
  { type: "LEFT", operators: ["&"], mapTo: mapToOperation },
  { type: "LEFT", operators: ["|"], mapTo: mapToOperation },
  // Numbers
  { type: "PRE", operators: ["-"], mapTo: mapPrefixToOperation },
  { type: "RIGHT", operators: ["**"], mapTo: mapToOperation },
  { type: "LEFT", operators: ["*", "/"], mapTo: mapToOperation },
  { type: "LEFT", operators: ["+", "-"], mapTo: mapToOperation },
  // Assignment
  { type: "KEYS_VALUE", operators: [":"], mapTo: mapToAssignment, keyParser: key },
  // Plurals
  { type: "LEFT", operators: [","], mapTo: mapToPlural },
  // Type
  { type: "PRE", operators: types, mapTo: mapToType },
  // Scope
  { type: "LEFT", operators: [";"], mapTo: mapToScope }
]

const parser = createOperatorsParser(table, basic)

module.exports = parser

// @TODO: Expression: Boolean, Number, String
// @TODO: + to Arithmetic and String concat (Operation, PrefixOperation, PostfixOperation, InfixOperation)
// @TODO: Casting single Expression, Plurals, Assignment

// @TODO: Indent / scopes
// @TODO: Comments
// @TODO: Key on BEGINNING OF LINE
// @TODO: aliases (::)
// @TODO: Optional closing opening brackets, parens
// @TODO: More abstract KEYS_VALUE
