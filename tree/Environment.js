const { all: types } = require("./types")
const Type = require("./Type")

class Environment {

  constructor (types = {}, keys = {}) {
    const buildInTypes = this.buildInTypes()
    this.types = { ...buildInTypes, ...types }
    this.keys = keys
  }

  // @TODO: Immutability
  addKey (key, expressions) {
    this.keys[key] = expressions
  }

  buildInTypes () {
    return types.reduce((acc, type) => {
      acc[type] = new Type(type)
      return acc
    }, {})
  }
}

module.exports = Environment
