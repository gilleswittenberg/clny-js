const Scalar = require("./Scalar")

class Boolean extends Scalar {

  constructor (value, literal) {
    super("Boolean", value, literal)
  }

  parse (literal) {
    return literal === "true" ? true : false
  }
}

module.exports = Boolean
