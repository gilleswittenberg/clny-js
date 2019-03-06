const fs = require("fs")
const assert = require("assert").strict
const util = require("util")

const { parse, toPromise } = require("arcsecond")


const root = require("./parsers/root")
const Expression = require("./tree/expressions/Expression")
const Assignment = require("./tree/expressions/Assignment")
const Scope = require("./tree/expressions/Scope")

// read file
assert.ok(process.argv[2], "Supply file: `node to-json.js --file`")
const path = process.argv[2]

// @TODO: Error handling
const fileContent = fs.readFileSync(path).toString()

// evaluation

function toObject (expressions) {

  const isExpression = value => value instanceof Expression
  const isAssignment = value => value instanceof Assignment
  const isScope = value => value instanceof Scope

  const toValue = expr => {
    if (isScope(expr)) {
      return expr.evaluate(true)
      //return toObject(expr.expressions)
    }
    if (isAssignment(expr)) {
      return toObject([expr])
    }
    if (isExpression(expr)) {
      return expr.evaluate()
    }
    // @TODO: ? throw / default case
  }

  const isValue = !expressions.every(isAssignment)
  if (isValue) {
    const isPlural = expressions.length > 1
    return isPlural ? expressions.map(toValue) : toValue(expressions[0])
  }

  const obj = {}

  expressions.forEach(expr => {
    const value = toObject(expr.expressions)
    expr.keys.forEach(key => {
      obj[key] = value
    })
  })

  return obj
}

const evaluate = rootScope => toObject(rootScope.expressions)
const output = result => console.info(util.inspect(result, { showHidden: false, depth: null, colors: true }))

const onSuccess = rootScope => {
  output(evaluate(rootScope))
}
const onError = err => console.error(err)

toPromise(parse(root)(fileContent))
  .then(onSuccess)
  .catch(onError)
