const Expression = require("./Expression")

module.exports = class Assignment extends Expression {

  constructor (keys, expressions) {
    super(null, expressions)
    this.keys = Array.isArray(keys) ? keys : [keys]
  }
}
