const Scalar = require("./Scalar")

class String extends Scalar {

  constructor (value, literal) {
    super("String", value, literal)
  }

  parse (literal) {
    return literal
  }
}

module.exports = String
