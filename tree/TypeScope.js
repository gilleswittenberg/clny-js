class TypeScope {

  constructor (name) {
    this.name = name
    this.properties = {}
    this.isEmpty = true
  }

  addProperty (property) {
    const keys = property.keys
    keys.forEach(key => {
      this.properties[key] = property
    })
    this.isEmpty = false
  }
}

module.exports = TypeScope
