const repl = require("repl")
const util = require("util")
const clny = require(".")

const output = result => console.info(util.inspect(result, { showHidden: false, depth: null, colors: true }))

const run = async (cmd, callback) => {
  try {
    const [result] = await clny(cmd)
    callback(output(result))
  } catch (err) {
    callback(err)
  }
}

const clnyEval = (cmd, context, filename, callback) =>
  run(cmd, callback)

repl.start({ prompt: "> ", eval: clnyEval })
