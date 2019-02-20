const fs = require("fs")
const { parse, toPromise } = require("arcsecond")

const scope = require("./parsers/scope/scope")
const Expression = require("./tree/Expression")

// read file
const filename = process.argv[2] + ".clny"
const dir = "sources"
const path = dir + "/" + filename

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
