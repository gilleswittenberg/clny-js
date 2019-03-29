const Scope = require("./Scope")
const Assignment = require("./Assignment")
const Application = require("./Application")
const Statement = require("./Statement")
const ConditionalStatement = require("./ConditionalStatement")
const Identity = require("./Identity")
const Environment = require("../Environment")

const toArray = require("../../utils/toArray")

const isScope = object => object instanceof Scope
const isApplication = object => object instanceof Application
const isStatement = object => object instanceof Statement
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

  evaluate (env) {
    if (this.isEmpty) return null
    const environment = env != null ? env.clone() : new Environment()
    this.value = this.evaluateFunctionScope(environment)
    this.isEvaluated = true
    return this.value
  }

  evaluateFunctionScope (env) {

    const isLast = (index, arr) => arr.length - 1 === index

    const initialScope = { hasReturned: false, returnValue: null, env }

    const evaluatedScope = this.expressions.reduce((scope, expression, index, arr) => {

      if (scope.hasReturned) return scope

      if (isApplication(expression)) {
        const evaluated = expression.evaluate(scope.env)
        if (isStatement(evaluated)) {
          expression = evaluated
        }
      }

      if (!isScope(expression)) {

        // conditional statements
        if (isSecondaryConditionalStatement(expression)) {

          const previousExpression = arr[index - 1]

          if (!isPrimaryConditionalStatement(previousExpression))
            throw new Error ("ConditionalStatement " + expression.name + " should be preceded by if Statement")

          if (previousExpression.value[0] === false) {
            expression.evaluate(scope.env)
          } else {
            expression.doNotEvaluate(previousExpression.value[1])
          }
        }

        // expressions
        else {
          expression.evaluate(scope.env)
        }
      }

      // Assignment
      if (isScopeOrAssignment(expression)) {
        const expressions = isScope(expression) ? expression : expression.expressions
        expression.keys.forEach(key => scope.env.set(key, expressions))
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
        const val = toArray(expression.value).join(", ")
        // @TODO: Type for Plural
        const expression0 = expression.expressions[0]
        const type = expression0 instanceof Identity ? expression0.expressions[0].type : expression0.type
        const value =
          name === "print" ? val :
            name === "log" ? new Date().toLocaleString() + " " + val :
              name === "debug" ? type + " " + val :
                (() => { throw new Error ("Invalid Print Statement") })()
        // eslint-disable-next-line no-console
        console.log(value)
      }

      return scope
    }, initialScope)

    return evaluatedScope.returnValue
  }
}

module.exports = FunctionScope
