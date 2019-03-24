const Scalar = require("./Scalar")

const properties = {
  concat: value => s => value + s
}

class String extends Scalar {

  constructor (value, literal) {
    super("String", properties, value, literal)
  }

  parse (literal) {
    return literal
  }
}

module.exports = String
