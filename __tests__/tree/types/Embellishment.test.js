const Embellishment = require("../../../tree/types/Embellishment")

describe("Embellishment", () => {

  test("property", () => {
    const embellishment = new Embellishment("Optional")
    expect(embellishment.property).toBe("Optional")
  })

  test("embellishment", () => {
    const embellishment = new Embellishment("@")
    expect(embellishment.property).toBe("Async")
  })

  test("throw", () => {
    expect(() => { new Embellishment("invalid") }).toThrow("invalid is not a valid Embellishment property or postfix")
  })
})
