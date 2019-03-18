class ScopeOpener {
  constructor (key, functionType) {
    this.key = key
    this.functionType = functionType
    this.isFunction = this.functionType != null
  }
}

module.exports = ScopeOpener
