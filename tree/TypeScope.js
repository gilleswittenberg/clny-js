class TypeScope {

  constructor (name) {
    this.name = name
    this.types = []
    this.isEmpty = true
  }

  addType (type) {
    this.types.push(type)
    this.isEmpty = false
  }
}

module.exports = TypeScope
