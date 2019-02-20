class Value {

  constructor (value) {

    this.value = value // subset of Javascript primitive values (non Undefined, non Symbol) + RegExp

    const type =
      // Null
      value == null ? "Null" :
        // Boolean
        typeof value === "boolean" ? "Boolean" :
          // Number
          typeof value === "number" ? "Number" :
            // String
            typeof value === "string" ? "String" :
              // RegExp
              value instanceof RegExp ? "RegExp" :
                // default
                (() => { throw "Value cannot be of type other than Null / Boolean / Number / String / RegExp" })()

    this.type = type // Null / Boolean / Number / String / RegExp
  }
}

module.exports = Value
