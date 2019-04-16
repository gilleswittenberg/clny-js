const ParseError = require("../../../tree/errors/ParseError")

test("ParseError", () => {
  try {
    throw new ParseError(3, "Error message")
  } catch (err) {
    expect(err.lineNumber).toBe(3)
    expect(err).toEqual(new Error("Error message"))
  }
})
