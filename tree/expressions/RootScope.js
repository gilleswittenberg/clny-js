const Scope = require("./Scope")

class RootScope extends Scope {
  constructor () {
    super()
    this.keys = null
    this.isRoot = true
  }
}

module.exports = RootScope
