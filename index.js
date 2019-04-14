const { parse, toPromise } = require("arcsecond")
const root = require("./parsers/root")
const Output = require("./tree/Output")

// mode: "run" | "json" | "parse"
const clny = async (content, mode = "run", shouldLog = true) => {

  Output.clear().setShouldLog(shouldLog)

  const asData = mode === "json"
  const shouldEvaluate = mode !== "parse"

  const rootScope = root(asData)
  try {
    const ast = await toPromise(parse(rootScope)(content))
    const result = shouldEvaluate ? ast.evaluate() : ast
    return [result, Output.lines]
  } catch (err) {
    throw new Error (err)
  }
}

module.exports = clny
