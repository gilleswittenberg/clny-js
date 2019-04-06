const toArray = require("../../utils/toArray")
const { isFunction } = require("../../utils/is")

const propertiesAny = {
  is: true,
  isPlural: false
}

const propertiesPlural = {
  ...propertiesAny,
  isPlural: true,
  length: value => () => value.length
}

class Expression {

  constructor (type, expressions, properties = {}) {
    this.type = type // string
    this.expressions = []
    this.addExpressions(expressions)
    this.isEvaluated = false
    this.shouldCast = false
    this.setProperties(properties)
  }

  setProperties (properties) {
    this.properties = {
      ...this.isPlural ? propertiesPlural : propertiesAny,
      ...properties
    }
  }

  hasProperty (name) {
    return this.properties[name] !== undefined
  }

  getProperty (name, environment) {
    if (this.hasProperty(name) === false)
      throw new Error (name + " is not a property of " + this.type)
    const property = this.properties[name]
    // @TODO: Remove circulair reference
    const Function = require("./scopes/Function")
    const value = this instanceof Function ? this : this.value
    if (isFunction(property)) return property(value, environment)
    return property
  }

  addExpressions (expressions) {
    toArray(expressions).forEach(expression => this.expressions.push(expression))
    this.setSize()
  }

  setSize () {
    const length = this.expressions.length
    this.isEmpty = length === 0
    this.isSingle = length === 1
    this.isPlural = length > 1
  }

  // overridden in Identity
  fetch () {
    return this
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const values = this.expressions.map(expression => expression.evaluate(env))
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values

    // @TODO: get type from environment and only pass this to castTo
    if (this.shouldCast) {
      const name = this.castToType
      if (env.has(name) === false) throw new Error (name + " is not an existing type")
      const type = env.get(name)
      this.castTo(type.value, type.isPlural)
    }

    this.isEvaluated = true
    return this.value
  }

  setCastToType (name) {
    this.castToType = name
    this.shouldCast = true
    return this
  }

  castTo (type, pluralize = false) {
    const name = pluralize ? type.pluralName : type.name
    this.type = name
    return this
    // @TODO: Cast to non scalar
  }
}

module.exports = Expression
