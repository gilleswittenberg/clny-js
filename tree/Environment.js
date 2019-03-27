const types = require("../buildins/types")
const Type = require("./Type")
const buildInKeys = require("../buildins/keys")

class Environment {

  constructor (types = {}, keys = {}) {
    const buildInTypes = this.buildInTypes()
    this.types = { ...buildInTypes, ...types }
    this.keys = { ...buildInKeys, ...keys }
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

  getType (name) {
    const typeByName = name => this.types[name]
    const type = typeByName(name)
    if (type != null) return [type, false]
    const names = Object.keys(this.types)
    const plural = names.map(name => typeByName(name)).find(type => type.pluralName === name)
    if (plural != null) return [plural, true]
    return [undefined]
  }
}

module.exports = Environment
