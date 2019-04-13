const fs = require("fs")
const { promisify } = require("util")
const readFile = promisify(fs.readFile)
const clny = require("../../index")

const run = async file => {
  const path = "sources/run/" + file
  const content = await readFile(path)
  return await clny(content.toString(), null, false)
}

describe("run", () => {

  test("cast-to-string", async () => {
    const [result, lines] = await run("cast-to-string.clny")
    expect(lines.length).toBe(0)
    expect(result).toBe("5")
  })

  test("functions", async () => {
    const [result, lines] = await run("functions.clny")
    expect(lines.length).toBe(5)
    expect(result).toBe("G")
  })

  test("output", async () => {
    const [result, lines] = await run("output.clny")
    expect(lines.length).toBe(3)
    expect(result).toBe(5)
  })

  test("type-constructor", async () => {
    const [,lines] = await run("type-constructor.clny")
    expect(lines.length).toBe(1)
  })
})
