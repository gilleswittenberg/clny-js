const toArray = require("../../utils/toArray")
const { isFunction } = require("../../utils/is")
const setVisibilityProperties = require("../types/setVisibilityProperties")

const propertiesAny = setVisibilityProperties({
  is: true,
  keys: ({ properties }) => {
    return Object.keys(properties)
      .map(key => properties[key])
      .filter(property => property.visibility === "DATA")
      .map(property => property.key)
  },
  isPlural: ({ isPlural }) => isPlural,
  size: ({ isEmpty, isSingle, value }) => {
    if (isEmpty) return 0
    if (isSingle) return 1
    return value.length
  }
})

class Expression {

  constructor (type, expressions, properties = {}) {
    this.type = type // string | Type
    this.expressions = []
    this.addExpressions(expressions)
    this.isEvaluated = false
    this.setProperties(properties)
    this.isCompound = this.getProperty("keys").length > 0
  }

  setProperties (properties) {
    this.properties = {
      ...propertiesAny,
      ...properties
    }
  }

  hasProperty (name) {
    return this.properties[name] !== undefined
  }

  getProperty (name, environment) {
    if (this.hasProperty(name) === false)
      throw new Error (name + " is not a property of " + this.type)
    const property = this.properties[name].property
    if (isFunction(property)) return property(this, environment)
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
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Expression
