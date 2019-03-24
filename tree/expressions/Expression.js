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

  getProperty (name) {
    if (this.hasProperty(name) === false) return undefined
    const property = this.properties[name]
    if (isFunction(property)) return property(this.value)
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

  evaluate (env) {

    if (this.isEvaluated) return this.value

    // constructor and casting for plurals
    // @TODO: This is quite messy. Ideally we would set this in the parsing stage. But this requires hardcoding scalar types.
    if (this.isPlural && this.expressions[0].shouldCast) {
      const castToType = this.expressions[0].castToType
      this.setCastToType(castToType)
      this.expressions[0].castToType = null
      this.expressions[0].shouldCast = false
    }

    const values = this.expressions.map(expression => expression.evaluate(env))
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values

    // @TODO: get type from environment and only pass this to castTo
    if (this.shouldCast) {
      const typeArray = env.getType(this.castToType)
      if (typeArray == null) throw new Error (this.castToType + " is not an existing type")
      const [type, isPlural] = type
      this.castTo(type, isPlural)
    }

    this.isEvaluated = true
    return this.value
  }

  setCastToType (type) {
    this.castToType = type
    this.shouldCast = true
    return this
  }

  castTo (type, pluralize = false) {
    const name = pluralize ? type.pluralName : type.name
    this.type = name
    // @TODO: Cast to non scalar
  }
}

module.exports = Expression
