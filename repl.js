const repl = require("repl")
const util = require("util")
const { parse, toPromise } = require("arcsecond")

const root = require("./parsers/root")
const rootScope = root()
const evaluate = rootScope => rootScope.evaluate()

const output = result => console.info(util.inspect(result, { showHidden: false, depth: null, colors: true }))

const run = (cmd, callback) =>
  toPromise(parse(rootScope)(cmd))
    .then(scope => callback(output(evaluate(scope))))
    .catch(err => callback(err))

const clnyEval = (cmd, context, filename, callback) => 
  run(cmd, callback)

repl.start({ prompt: "> ", eval: clnyEval })
