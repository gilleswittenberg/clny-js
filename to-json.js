const fs = require("fs")
const assert = require("assert").strict
const util = require("util")

const { parse, toPromise } = require("arcsecond")


const scope = require("./parsers/scope/scope")
const Expression = require("./tree/Expression")
const Assignment = require("./tree/expressions/Assignment")

// read file
assert.ok(process.argv[2], "Supply file: `node to-json.js --file`")
const path = process.argv[2]

// @TODO: Error handling
const fileContent = fs.readFileSync(path).toString()

// evaluation

function toObject (expressions) {

  const isExpression = value => value instanceof Expression
  const isAssignment = value => value instanceof Assignment

  const toValue = expr => {
    if (isExpression(expr)) {
      return expr.evaluate().value
    }
    if (isAssignment(expr)) {
      return toObject([expr])
    }
    // @TODO: ? throw / default case
  }

  const isValue = expressions.some(isExpression)
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

const evaluate = ast => toObject(ast)
const output = result => console.info(util.inspect(result, { showHidden: false, depth: null, colors: true }))

const onSuccess = ast => {
  output(evaluate(ast))
}
const onError = err => console.error(err)

toPromise(parse(scope)(fileContent))
  .then(onSuccess)
  .catch(onError)
