const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  isFalse: value => () => value === false,
  isTrue: value => () =>  value === true
})

class Boolean extends Scalar {

  constructor (value, literal) {
    super("Boolean", properties, value, literal)
  }

  parse (literal) {
    return literal === "true" ? true : false
  }
}

module.exports = Boolean
