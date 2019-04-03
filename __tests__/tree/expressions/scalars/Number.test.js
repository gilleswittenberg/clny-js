const Number = require("../../../../tree/expressions/scalars/Number")

describe("Number", () => {

  test("value, literal", () => {
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

  test("typeCheck", () => {
    expect(new Number(0).typeCheck()).toBe("Number")
  })


  describe("properties", () => {

    test("equals", () => {
      const number = new Number(5, "5")
      expect(typeof number.properties.equals).toBe("function")
      expect(number.getProperty("equals")(5)).toBe(true)
      expect(number.getProperty("equals")(3)).toBe(false)
    })
  })
})
