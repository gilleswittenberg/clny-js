const fs = require("fs")
const assert = require("assert").strict

const scripts = ["json", "run", "parse"]
const scriptsString = scripts.join(" / ")
const message = "Fail!, documentation: `node index.js (" + scriptsString + ") --file`"

const script = process.argv[2]
assert.ok(scripts.includes(script), message)

assert.ok(process.argv[3], message)
const path = process.argv[3]

// @TODO: Error handling
const fileContent = fs.readFileSync(path).toString()


// evaluation

const { parse, toPromise } = require("arcsecond")
const root = require("./parsers/root")
const util = require("util")
const asData = script === scripts[0] ? true : false

const rootScope = root(asData)

const evaluate = rootScope => rootScope.evaluate()
const output = result => console.info(util.inspect(result, { showHidden: false, depth: null, colors: true }))

const onSuccess = rootScope => script === "parse" ? output(rootScope) : output(evaluate(rootScope))
const onError = err => console.error(err)

toPromise(parse(rootScope)(fileContent))
  .then(onSuccess)
  .catch(onError)
