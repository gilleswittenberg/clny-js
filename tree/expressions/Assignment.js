const Expression = require("./Expression")
const toArray = require("../../utils/toArray")

class Assignment extends Expression {

  constructor (keys, expressions) {
    super(null, expressions)
    this.keys = toArray(keys)
  }
}

module.exports = Assignment
