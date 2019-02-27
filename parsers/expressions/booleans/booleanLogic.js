const boolean = require("./boolean")
const BooleanLogic = require("../../../tree/BooleanLogic")

const createOperatorsParser = require("../../convenience/createOperatorsParser")

const mapPrefixToBooleanLogic = expression => {
  const evaluate = expression => {
    const operator = expression[0]
    const snd = expression[1]
    const value = Array.isArray(snd) ? evaluate(snd) : snd
    return new BooleanLogic(operator, value)
  }
  return evaluate(expression)
}

const mapToBooleanLogic = expression => {
  if (expression.length === 1) return expression[0]
  const evaluate = expression => {
    const operator = expression[0]
    const value = expression[1]
    const value1 = expression[2]
    const operand = Array.isArray(value) ? evaluate(value) : value
    const operand1 = Array.isArray(value1) ? evaluate(value1) : value1
    return new BooleanLogic(operator, operand, operand1)
  }
  return evaluate(expression)
}

const table = [
  { type: "PRE", operators: ["!"], mapTo: mapPrefixToBooleanLogic },
  { type: "LEFT", operators: ["&"], mapTo: mapToBooleanLogic },
  { type: "LEFT", operators: ["|"], mapTo: mapToBooleanLogic }
]

const booleanLogic = createOperatorsParser(table, boolean)

module.exports = booleanLogic
