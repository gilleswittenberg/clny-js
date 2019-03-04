const Expression = require("./Expression")

class Scope extends Expression {
  constructor (keys = []) {
    super("Scope", [])
    this.keys = Array.isArray(keys) ? keys : [keys]
    this.isRoot = false
  }
}

module.exports = Scope
