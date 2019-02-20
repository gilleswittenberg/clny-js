const {
  toValue,
  parse
} = require("arcsecond")
const string = require("../../../parsers/expressions/string")

test("string", () => {
  expect(toValue(parse(string)(`"Abc"`))).toBe("Abc")
  expect(toValue(parse(string)(`"D\\""`))).toBe(`D\\"`)
  expect(toValue(parse(string)(`"AB\n`))).toBe("AB")
  expect(toValue(parse(string)(`"Abcd   \n`))).toBe("Abcd")
  expect(toValue(parse(string)(`" Abcd e \n`))).toBe(" Abcd e")
})
