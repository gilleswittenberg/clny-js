const {
  isString,
  isArray
} = require("./is")

module.exports = chars => {
  if (isArray(chars)) return chars.join("")
  if (isString(chars)) return chars
  return ""
}
