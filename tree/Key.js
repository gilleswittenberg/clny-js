const visibilityMap = {
  "_": "PRIVATE",
  "'": "CONVENIENCE"
}

class Key {

  constructor (name, prefix, embellishment) {
    this.name = name
    this.visibility = visibilityMap[prefix] || "DATA"
    this.embellishment = embellishment
  }
}

module.exports = Key
