const Expression = require("../Expression")

const toArray = require("../../../utils/toArray")

class Scope extends Expression {

  constructor (keys = [], expressions = [], properties = {}) {
    super("Scope", expressions, properties)
    this.keys = toArray(keys)
    this.types = {}
  }

  addType (name, type) {
    this.types[name] = type
  }
}

module.exports = Scope
