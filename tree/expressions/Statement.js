const Expression = require("./Expression")

class Statement extends Expression {

  constructor (name, expressions) {
    super("Statement", expressions)
    this.name = name
  }
}

module.exports = Statement
