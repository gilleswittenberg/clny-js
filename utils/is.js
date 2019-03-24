const isString = value => typeof value === "string"
const isArray = value => Array.isArray(value)
const isFunction = value => typeof value === "function"

module.exports = {
  isString,
  isArray,
  isFunction
}

// @TODO: Partial application
// is(Any): (global)
// is: (not null)
// is(String): type / instance
