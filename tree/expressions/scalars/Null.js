const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  is: false
})

class Null extends Scalar {

  constructor (value, literal) {
    super("Null", properties, value, literal)
  }

  parse () {
    return null
  }
}

module.exports = Null
