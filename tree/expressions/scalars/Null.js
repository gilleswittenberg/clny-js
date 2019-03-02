const Scalar = require("./Scalar")

class Null extends Scalar {

  constructor (value, literal) {
    super("Null", value, literal)
  }

  parse () {
    return null
  }
}

module.exports = Null
