const toArray = require("../../utils/toArray")

class Expression {

  constructor (type, expressions) {
    this.type = type
    this.expressions = []
    this.addExpressions(expressions)
    this.isEvaluated = false
    this.shouldCast = false
    this.properties = {}
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

    if (this.shouldCast) this.castTo(this.castToType, env.types)

    this.isEvaluated = true
    return this.value
  }

  setCastToType (type) {
    this.castToType = type
    this.shouldCast = true
    return this
  }

  castTo (type, types) {
    const name = type.name
    const exists = types[name] != null
    if (exists === false)
      throw new Error (name + " is not an existing type")
    this.type = name
  }
}

module.exports = Expression
