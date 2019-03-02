const string = require("./string")
const StringConcatenation = require("../../../tree/expressions/operations/StringConcatenation")

const createOperatorsParser = require("../../convenience/createOperatorsParser")

const mapToString = expression => {
  if (expression.length === 1) return expression[0]
  const evaluate = expression => {
    const value = expression[1]
    const value1 = expression[2]
    const operand = Array.isArray(value) ? evaluate(value) : value
    const operand1 = Array.isArray(value1) ? evaluate(value1) : value1
    return new StringConcatenation(operand, operand1)
  }
  return evaluate(expression)
}

const table = [
  { type: "LEFT", operators: ["+"], mapTo: mapToString }
]

const stringConcatenation = createOperatorsParser(table, string)

module.exports = stringConcatenation
