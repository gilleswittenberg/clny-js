const Scalar = require("./Scalar")

const properties = {
  is: false
}

class Null extends Scalar {

  constructor (value, literal) {
    super("Null", properties, value, literal)
  }

  parse () {
    return null
  }
}

module.exports = Null
