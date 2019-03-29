const Expression = require("../Expression")

const toArray = require("../../../utils/toArray")

class Scope extends Expression {

  constructor (keys = [], expressions = [], isRoot = false) {
    super("Scope", expressions)
    this.keys = toArray(keys)
    this.isRoot = isRoot
    this.types = {}
  }

  addType (name, type) {
    this.types[name] = type
  }
}

module.exports = Scope
