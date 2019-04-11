const { execSync } = require("child_process")

const runFile = file => execSync("node index.js run sources/run/" + file).toString()
const outputToLinesAndResult = output => {
  const splitted = output.split("\n").slice(0, -1)
  const lines = splitted.slice(0, -1)
  // 5 is length of quotes around output
  const result = splitted[splitted.length - 1].slice(5, -5)
  return [lines, result]
}
const run = file => outputToLinesAndResult(runFile(file))

describe("run", () => {

  test("cast-to-string", () => {
    const [lines, result] = run("cast-to-string.clny")
    expect(lines.length).toBe(0)
    expect(result).toBe("'5'")
  })

  test("functions", () => {
    const [lines, result] = run("functions.clny")
    expect(lines.length).toBe(5)
    expect(result).toBe("'G'")
  })

  test("output", () => {
    const [lines, result] = run("output.clny")
    expect(lines.length).toBe(3)
    expect(result).toBe("5")
  })

  test("type-constructor", () => {
    const [lines] = run("type-constructor.clny")
    expect(lines.length).toBe(1)
  })
})
