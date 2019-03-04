const StringConcatenation = require("../../tree/expressions/operations/StringConcatenation")

test("not", () => {
  const stringResult = new StringConcatenation("ABC", "DEF!").evaluate()
  expect(stringResult).toBe("ABCDEF!")
})
