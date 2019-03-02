const Scalar = require("./Scalar")

class Number extends Scalar {

  constructor (value, literal) {
    super("Number", value, literal)
  }

  parse (literal) {
    return parseFloat(literal.replace(/_/g, ""))
  }
}

module.exports = Number
