const { types } = require("./types")

class Value {

  constructor (value, castToType) {

    let type =
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

    if (castToType && type != castToType) {
      if (types.flat().includes(castToType) === false) {
        throw "Not a valid type: " + castToType
      }
      switch (castToType) {
      case "Null":
        value = null
        break
      case "Boolean":
        value = Boolean(value)
        type = "Boolean"
        break
      case "Number":
        value = parseFloat(value)
        type = "Number"
        break
      case "String":
        value = String(value)
        break
      case "RegExp":
        // @TODO: Flags
        value = new RegExp(String(value))
        break
      }
      type = castToType
    }

    this.value = value // subset of Javascript primitive values (non Undefined, non Symbol) + RegExp
    this.type = type // Null / Boolean / Number / String / RegExp
  }
}

module.exports = Value
