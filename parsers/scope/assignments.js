const {
  sepBy1
} = require("arcsecond")

const { comma } = require("../convenience/tokens")
const { whitespaced } = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const assignment = require("./assignment")

const assignments = wrappedInParentheses(
  sepBy1(whitespaced(comma))(assignment)
)

module.exports = assignments
