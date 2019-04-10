const Expression = require("../Expression")

class Statement extends Expression {

  constructor (name, expressions) {
    super("Statement", expressions)
    this.name = name
  }

  apply (args) {
    this.arguments = args
    return this
  }
}

module.exports = Statement
