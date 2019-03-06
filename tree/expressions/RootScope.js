const Scope = require("./Scope")

class RootScope extends Scope {

  constructor (expressions = []) {
    const expressionsArray = Array.isArray(expressions) ? expressions : [expressions]
    super("RootScope", expressionsArray)
    this.keys = null
    this.isRoot = true
  }
}

module.exports = RootScope
