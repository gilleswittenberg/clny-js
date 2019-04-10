const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  equals: ({ value }) => n => value === n
})

class Number extends Scalar {

  constructor (value, literal) {
    super("Number", properties, value, literal)
  }

  parse (literal) {
    const num = parseFloat(literal.replace(/_/g, ""))
    return isNaN(num) ? 0 : num
  }
}

module.exports = Number
