const Scope = require("./Scope")
const Assignment = require("./Assignment")
const Statement = require("../expressions/Statement")

const isScope = object => object instanceof Scope
const isAssignment = object => object instanceof Assignment
const isScopeOrAssignment = object => isScope(object) || isAssignment(object)
const isReturnStatement = object => object instanceof Statement && object.name === "return"
const isPrintStatement = object => object instanceof Statement && ["print", "log", "debug"].includes(object.name)

class FunctionScope extends Scope {

  constructor (keys = [], expressions = []) {
    super(keys, expressions)

    this.properties = {
      apply: () => this.evaluateFunctionScope()
    }
  }

  evaluate (scope) {
    if (this.isEmpty) return null
    return this.evaluateFunctionScope(scope)
  }

  evaluateFunctionScope (scope = {}) {

    const isLast = (index, arr) => arr.length - 1 === index

    const initialScope = { hasReturned: false, returnValue: null, keys: scope }

    const evaluatedScope = this.expressions.reduce((scope, expression, index, arr) => {

      if (scope.hasReturned) return scope

      if (!isScope(expression)) {
        expression.evaluate(scope.keys)
      }

      // Assignment
      if (isScopeOrAssignment(expression)) {
        const expressions = isScope(expression) ? expression : expression.expressions
        expression.keys.forEach(key => scope.keys[key] = expressions)
      }

      // return
      if (isReturnStatement(expression) || isLast(index, arr)) {
        scope.returnValue = isScope(expression) ? expression : expression.value
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

module.exports = FunctionScope
