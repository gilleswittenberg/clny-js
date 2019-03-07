const Expression = require("./Expression")
const Assignment = require("./Assignment")
const Statement = require("../expressions/Statement")

const toArray = require("../../utils/toArray")

const isScope = object => object instanceof Scope
const isAssignment = object => object instanceof Assignment
const isScopeOrAssignment = object => isScope(object) || isAssignment(object)
const isReturnStatement = object => object instanceof Statement && object.name === "return"
const isPrintStatement = object => object instanceof Statement && ["print", "log", "debug"].includes(object.name)

class Scope extends Expression {

  constructor (keys = [], expressions = []) {
    super("Scope", toArray(expressions))
    this.keys = toArray(keys)
    this.isRoot = false
  }

  // @TODO: Global asData setting
  evaluate (asData = false) {

    if (this.isEmpty) return null
    if (asData) {
      const key = this.keys != null ? this.keys[0] : null
      const value = this.evaluateDataScope()
      return key != null ? { [key]: value } : value
    }
    return this.evaluateFunctionScope()
  }

  evaluateDataScope () {

    this.expressions.forEach(expression => expression.evaluate(true))

    const evaluateToMap = this.expressions.every(isScopeOrAssignment)

    // create map e.g. ({ k: 5, l: 6 })
    if (evaluateToMap) {
      return this.expressions.reduce((acc, expression) => {
        expression.keys.forEach(key => acc[key] = expression.value)
        return acc
      }, {})
    }

    // create array e.g. ([5, 6, { k: 7 }])
    return this.expressions.map(expression => {
      if (isScopeOrAssignment(expression)) {
        return expression.keys.reduce((acc, key) => {
          acc[key] = expression.value
          return acc
        }, {})
      }
      return expression.value
    })
  }

  evaluateFunctionScope () {

    const isLast = (index, arr) => arr.length - 1 === index

    const initialScope = { hasReturned: false, returnValue: null, keys: {} }

    const evaluatedScope = this.expressions.reduce((scope, expression, index, arr) => {

      if (scope.hasReturned) return scope
      expression.evaluate(scope.keys)

      // Assignment
      if (expression instanceof Assignment) {
        expression.keys.forEach(key => scope.keys[key] = expression.expressions)
      }

      // return
      if (isReturnStatement(expression) || isLast(index, arr)) {
        scope.returnValue = expression.value
        scope.hasReturned = true
      }

      // print
      if (isPrintStatement(expression)) {
        // @TODO: Different outputs for print, log, debug
        // eslint-disable-next-line no-console
        console.log(expression.value)
      }

      return scope
    }, initialScope)

    return evaluatedScope.returnValue
  }
}

module.exports = Scope
