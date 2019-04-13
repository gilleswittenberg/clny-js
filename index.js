const { parse, toPromise } = require("arcsecond")
const root = require("./parsers/root")

// mode: "run" | "json" | "parse"
const clny = async (content, mode = "run") => {

  const asData = mode === "json"
  const shouldEvaluate = mode !== "parse"
  
  const rootScope = root(asData)
  try {
    const ast = await toPromise(parse(rootScope)(content))
    return shouldEvaluate ? ast.evaluate() : ast
  } catch (err) {
    return new Error (err)
  }
}

module.exports = clny
