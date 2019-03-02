const number = require("./number")
const Arithmetic = require("../../../tree/expressions/operations/Arithmetic")

const createOperatorsParser = require("../../convenience/createOperatorsParser")

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

// @TODO: postfix (!) factorial
const table = [
  { type: "PRE", operators: ["-"], mapTo: mapPrefixToArithmetic },
  { type: "RIGHT", operators: ["**"], mapTo: mapToArithmetic },
  { type: "LEFT", operators: ["*", "/"], mapTo: mapToArithmetic },
  { type: "LEFT", operators: ["+", "-"], mapTo: mapToArithmetic }
]

const arithmetic = createOperatorsParser(table, number)

module.exports = arithmetic
