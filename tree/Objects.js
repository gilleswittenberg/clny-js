const Object = require("./Object")

class Objects extends Object {

  constructor (expressions) {
    super()
    this.expressions = expressions // Objects
    this.type = "Plural"
    this.isEvaluated = false
  }

  evaluate () {
    this.expressions.forEach(expression => expression.evaluate())
    this.isEvaluated = true
    return this.expressions
  }
}

module.exports = Objects
