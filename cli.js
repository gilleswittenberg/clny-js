const fs = require("fs")
const assert = require("assert").strict
const util = require("util")
const clny = require(".")

// cli arguments
const scripts = ["json", "run", "parse"]
const scriptsString = scripts.join(" / ")
const message = "Fail!, documentation: `node index.js (" + scriptsString + ") --file`"

const script = process.argv[2]
assert.ok(scripts.includes(script), message)

const path = process.argv[3]
assert.ok(path, message)

// @TODO: Error handling
const fileContent = fs.readFileSync(path).toString()

// evaluation
const output = result => console.info(util.inspect(result, { showHidden: false, depth: null, colors: true }))
const main = async () => {
  try {
    const [result] = await clny(fileContent, script)
    output(result)
  } catch (err) {
    throw err
  }
}

main()
