const Scope = require("./Scope")
const toArray = require("../../utils/toArray")

class RootScope extends Scope {

  constructor (expressions = []) {
    super("RootScope", toArray(expressions))
    this.keys = null
    this.isRoot = true
  }
}

module.exports = RootScope
