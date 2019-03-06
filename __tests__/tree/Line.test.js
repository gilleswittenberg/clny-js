const Line = require("../../tree/Line")
const Comment = require("../../tree/Comment")

test("empty", () => {
  const line = new Line("", 1)
  expect(line.isComment).toBe(false)
  expect(line.isEmpty).toBe(true)
})

test("indent, expression, comment eol", () => {
  const line = new Line("  5 # comment", 1, 1)
  expect(line.isComment).toBe(false)
  expect(line.isEmpty).toBe(false)
  expect(line.indents).toBe(1)
  expect(line.content).toBe("5 ")
})

test("comment", () => {
  const line = new Line("# comment", 1)
  expect(line.isComment).toBe(true)
  expect(line.isEmpty).toBe(false)
  expect(line.content).toBe("")
  expect(line.parsedComments[0]).toBeInstanceOf(Comment)
})
