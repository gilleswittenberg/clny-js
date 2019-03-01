const {
  choice
} = require("arcsecond")

const nullParser = require("./expressions/null")
const boolean = require("./expressions/booleans/boolean")
const number = require("./expressions/numbers/number")
const string = require("./expressions/strings/string")
const identity = require("./expressions/identity")
const key = require("./scope/key")

//const BooleanLogic = require("../tree/BooleanLogic")
const Arithmetic = require("../tree/Arithmetic")
const Objects = require("../tree/Objects")
const Assignment = require("../tree/Assignment")

const notOperator = operator => expression => expression !== operator

const basic = choice([
  nullParser,
  boolean,
  number,
  string,
  identity
])

const createOperatorsParser = require("./convenience/createOperatorsParser")

const mapPrefixToArithmetic = expression => {
  const evaluate = expression => {
    const operator = expression[0]
    const snd = expression[1]
    const value = Array.isArray(snd) ? evaluate(snd) : snd
    return new Arithmetic(operator, value)
  }
  return evaluate(expression)
}

const mapToArithmetic = expression => {
  if (expression.length === 1) return expression[0]
  const evaluate = expression => {
    const operator = expression[0]
    const value = expression[1]
    const value1 = expression[2]
    const operand = Array.isArray(value) ? evaluate(value) : value
    const operand1 = Array.isArray(value1) ? evaluate(value1) : value1
    return new Arithmetic(operator, operand, operand1)
  }
  return evaluate(expression)
}

const mapToAssignment = expressions => {
  const keysAndExpression = expressions.filter(notOperator(":"))
  return keysAndExpression.reverse().reduce((acc, cur) => acc == null ? cur : new Assignment([cur], [acc]))
}

const mapToObjects = expressions =>
  new Objects(expressions.flat(Infinity).filter(notOperator(",")))

const table = [
  { type: "PRE", operators: ["-"], mapTo: mapPrefixToArithmetic },
  { type: "RIGHT", operators: ["**"], mapTo: mapToArithmetic },
  { type: "LEFT", operators: ["*", "/"], mapTo: mapToArithmetic },
  { type: "LEFT", operators: ["+", "-"], mapTo: mapToArithmetic },
  { type: "KEYS_VALUE", operators: [":"], mapTo: mapToAssignment, keyParser: key },
  { type: "LEFT", operators: [","], mapTo: mapToObjects }
]

const parser = createOperatorsParser(table, basic)

module.exports = parser

// @TODO: + to Arithmetic and String concat (Operation, PrefixOperation, PostfixOperation, InfixOperation)
// @TODO: Expression: Boolean, Number, String
// @TODO: More abstract KEYS_VALUE
// @TODO: Key on first begin of line
// @TODO: Indent / scopes
// @TODO: aliases (::)
// @TODO: Optional closing opening brackets, parens
