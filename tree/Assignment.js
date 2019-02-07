const Object = require("./Object")

module.exports = class Assignment extends Object {

  constructor (keys, expressions) {
    super()
    const isAssignment = expressions instanceof Assignment
    this.keys = isAssignment ? keys.concat(expressions.keys) : keys
    this.expressions = isAssignment ? expressions.expressions : expressions
    this.kinds = ["Impure"]
  }
}
