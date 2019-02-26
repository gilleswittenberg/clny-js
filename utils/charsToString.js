const {
  isString
} = require("./is")

module.exports = (...chars) =>
  chars.flat(Infinity).filter(isString).join("")
