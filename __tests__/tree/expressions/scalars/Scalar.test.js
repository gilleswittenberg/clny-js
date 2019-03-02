const Null = require("../../../../tree/expressions/scalars/Null")
const Boolean = require("../../../../tree/expressions/scalars/Boolean")
const Number = require("../../../../tree/expressions/scalars/Number")
const String = require("../../../../tree/expressions/scalars/String")

test("Null", () => {
  expect(new Null(null).value).toBe(null)
  expect(new Null(null).literal).toBe(undefined)
  expect(new Null(null, "null").value).toBe(null)
  expect(new Null(null, "null").literal).toBe("null")
})

test("Boolean", () => {
  expect(new Boolean(false).value).toBe(false)
  expect(new Boolean(false).literal).toBe(undefined)
  expect(new Boolean(null, "true").value).toBe(true)
  expect(new Boolean(null, "true").literal).toBe("true")
})

test("Number", () => {
  expect(new Number(5).value).toBe(5)
  expect(new Number(6).literal).toBe(undefined)
  expect(new Number(null, "7").value).toBe(7)
  expect(new Number(null, "8").literal).toBe("8")

  // parse
  expect(new Number(null, "1_000_000").value).toBe(1000000)
  expect(new Number(null, "1___").value).toBe(1)
  expect(new Number(null, "1.2").value).toBe(1.2)
  expect(new Number(null, "0.1").value).toBe(0.1)
  expect(new Number(null, "3.").value).toBe(3)
  expect(new Number(null, "3_0_.2_5_").value).toBe(30.25)
  expect(new Number(null, "06").value).toBe(6)
  expect(new Number(null, "000.23").value).toBe(0.23)
  expect(new Number(null, "1e1").value).toBe(10)
  expect(new Number(null, "1.2e-1").value).toBe(0.12)
  expect(new Number(null, "12E2").value).toBe(1200)
})

test("String", () => {
  expect(new String("a").value).toBe("a")
  expect(new String("ab").literal).toBe(undefined)
  expect(new String(null, "Abc").value).toBe("Abc")
  expect(new String(null, "Abcd").literal).toBe("Abcd")
})
