const isString = value => typeof value === "string"
const isArray = value => Array.isArray(value)

module.exports = {
  isString,
  isArray
}

// @TODO: Partial application
// is(Any): (global)
// is: (not null)
// is(String): type / instance
