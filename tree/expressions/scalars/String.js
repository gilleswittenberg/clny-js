const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  concat: value => s => value + s
})

class String extends Scalar {

  constructor (value, literal) {
    super("String", properties, value, literal)
  }

  parse (literal) {
    return literal
  }
}

module.exports = String
