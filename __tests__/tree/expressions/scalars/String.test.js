const String = require("../../../../tree/expressions/scalars/String")

describe("String", () => {

  test("literal, value", () => {
    expect(new String("a").value).toBe("a")
    expect(new String("ab").literal).toBe(undefined)
    expect(new String(null, "Abc").value).toBe("Abc")
    expect(new String(null, "Abcd").literal).toBe("Abcd")
  })

  describe("properties", () => {

    test("concat", () => {
      const string = new String("A")
      expect(typeof string.properties.concat).toBe("function")
      expect(string.getProperty("concat")("bc")).toBe("Abc")
    })
  })
})
