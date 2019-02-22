const Object = require("./Object")

module.exports = class Assignment extends Object {

  constructor (keys, expressions) {
    super()
    this.keys = keys
    this.expressions = expressions
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
  }
}
