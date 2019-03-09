const Scope = require("./Scope")
const Assignment = require("./Assignment")
const Statement = require("../expressions/Statement")
const ConditionalStatement = require("../expressions/ConditionalStatement")

const isScope = object => object instanceof Scope
const isAssignment = object => object instanceof Assignment
const isScopeOrAssignment = object => isScope(object) || isAssignment(object)
const isReturnStatement = object => object instanceof Statement && object.name === "return"
const isPrintStatement = object => object instanceof Statement && ["print", "log", "debug"].includes(object.name)
const isPrimaryConditionalStatement = object => object instanceof ConditionalStatement && ["if", "elseif"].includes(object.name)
const isSecondaryConditionalStatement = object => object instanceof ConditionalStatement && ["elseif", "else"].includes(object.name)

class FunctionScope extends Scope {

  constructor (keys = [], expressions = []) {
    super(keys, expressions)

    this.properties = {
      apply: () => this.evaluateFunctionScope()
    }
  }

  evaluate (scope) {
    if (this.isEmpty) return null
    this.value = this.evaluateFunctionScope(scope)
    this.isEvaluated = true
    return this.value
  }

  evaluateFunctionScope (scope = {}) {

    const isLast = (index, arr) => arr.length - 1 === index

    const initialScope = { hasReturned: false, returnValue: null, keys: scope }

    const evaluatedScope = this.expressions.reduce((scope, expression, index, arr) => {

      if (scope.hasReturned) return scope

      if (!isScope(expression)) {

        // conditional statements
        if (isSecondaryConditionalStatement(expression)) {
          const previousExpression = arr[index - 1]
          if (!isPrimaryConditionalStatement(previousExpression)) {
            throw "ConditionalStatement " + expression.name + " should be preceded by if Statement"
          }
          if (previousExpression.value[0] === false) {
            expression.evaluate(scope.keys)
          } else {
            expression.doNotEvaluate(previousExpression.value[1])
          }
        }

        // expressions
        else {
          expression.evaluate(scope.keys)
        }
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
        // @TODO: Move logic into PrintStatement
        const name = expression.name
        const val = expression.value
        // @TODO: Type for Plural
        const type = expression.expressions[0].type
        const value =
          name === "print" ? val :
            name === "log" ? new Date().toLocaleString() + " " + val :
              name === "debug" ? type + " " + val :
                (() => { throw "Invalid Print Statement" })()
        // eslint-disable-next-line no-console
        console.log(value)
      }

      return scope
    }, initialScope)

    return evaluatedScope.returnValue
  }
}

module.exports = FunctionScope
