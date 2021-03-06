const Boolean = require("../../../../tree/expressions/scalars/Boolean")

describe("Boolean", () => {

  test("value, literal", () => {
    expect(new Boolean(false).value).toBe(false)
    expect(new Boolean(false).literal).toBe(undefined)
    expect(new Boolean(null, "true").value).toBe(true)
    expect(new Boolean(null, "true").literal).toBe("true")
  })

  test("typeCheck", () => {
    expect(new Boolean(false).typeCheck()).toBe("Boolean")
  })

  describe("properties", () => {

    test("false isFalse, isTrue", () => {
      const boolean = new Boolean(false, "false")
      expect(typeof boolean.getProperty("isFalse")).toBe("function")
      expect(typeof boolean.getProperty("isTrue")).toBe("function")
      expect(boolean.getProperty("isFalse")()).toBe(true)
      expect(boolean.getProperty("isTrue")()).toBe(false)
    })

    test("true isFalse, isTrue", () => {
      const boolean = new Boolean(true, "true")
      expect(boolean.getProperty("isFalse")()).toBe(false)
      expect(boolean.getProperty("isTrue")()).toBe(true)
    })
  })
})
