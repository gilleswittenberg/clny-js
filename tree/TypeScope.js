class TypeScope {

  constructor (name) {
    this.name = name
    this.properties = {}
    this.isEmpty = true
  }

  addProperty (property) {
    const key = property.key
    this.properties[key] = property
    this.isEmpty = false
  }
}

module.exports = TypeScope
