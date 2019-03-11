class TypeScope {

  constructor (name) {
    this.name = name
    this.properties = {}
  }

  addProperty (property) {
    const key = property.key
    this.properties[key] = property
  }
}

module.exports = TypeScope
