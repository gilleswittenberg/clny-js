const Statement = require("./Statement")

class ReturnStatement extends Statement {

  constructor (expressions) {
    super("Statement", expressions)
    this.name = "return"
  }
}

module.exports = ReturnStatement
