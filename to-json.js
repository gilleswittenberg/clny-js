const fs = require("fs")
const assert = require("assert").strict
const { parse, toPromise } = require("arcsecond")


const scope = require("./parsers/scope/scope")
const Expression = require("./tree/Expression")

// read file
assert.ok(process.argv[2], "Supply file: `node to-json.js --file`")
const path = process.argv[2]

// @TODO: Error handling
const fileContent = fs.readFileSync(path).toString()

// evaluation

function toObject (expressions) {

  const isPlural = expressions.length > 1
  const isExpression = expressions.every(expr => expr instanceof Expression)
  const toValue = expr => expr.value.value
  if (isExpression) {
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
const output = result => console.info(result)

const onSuccess = ast => {
  output(evaluate(ast))
}
const onError = () => console.error("parse Error")

toPromise(parse(scope)(fileContent))
  .then(onSuccess)
  .catch(onError)
