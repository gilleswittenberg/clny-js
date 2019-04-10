class TypeScope {

  constructor (name) {
    this.name = name
    this.types = []
    this.properties = []
    this.isEmpty = true
  }

  addType (type) {
    this.types.push(type)
    this.isEmpty = false
  }

  addProperty (property) {
    this.properties.push(property)
    this.isEmpty = false
  }
}

module.exports = TypeScope
