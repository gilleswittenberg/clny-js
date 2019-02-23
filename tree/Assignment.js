const Object = require("./Object")

module.exports = class Assignment extends Object {

  constructor (keys, expressions) {
    super()
    // @TODO: pluralize single key
    this.keys = keys
    // @TODO: pluralize single expression
    this.expressions = expressions
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
  }
}
