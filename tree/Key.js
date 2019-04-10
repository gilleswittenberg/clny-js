const visibilityMap = {
  "_": "PRIVATE",
  "'": "CONVENIENCE"
}

class Key {

  constructor (name, prefix) {
    this.name = name
    this.visibility = visibilityMap[prefix] || "DATA"
  }
}

module.exports = Key
