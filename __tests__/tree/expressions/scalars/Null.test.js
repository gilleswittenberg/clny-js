const Null = require("../../../../tree/expressions/scalars/Null")

describe("Null", () => {

  test("value, literal", () => {
    expect(new Null(null).value).toBe(null)
    expect(new Null(null).literal).toBe(undefined)
    expect(new Null(null, "null").value).toBe(null)
    expect(new Null(null, "null").literal).toBe("null")
  })

  test("typeCheck", () => {
    expect(new Null().typeCheck()).toBe("Null")
  })

  describe("properties", () => {

    test("is", () => {
      const nullValue = new Null(null, "null")
      expect(nullValue.getProperty("is")).toBe(false)
    })
  })
})
