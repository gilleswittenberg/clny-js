// @LINK: https://github.com/jneen/parsimmon/blob/master/examples/math.js
// @TODO: postfix

const {
  char,
  str,
  sequenceOf,
  many,
  choice,
  anyOfString,
  pipeParsers,
  recursiveParser,
  between,
  mapTo
} = require("arcsecond")

const {
  whitespaced
} = require("./whitespace")

const prefix = (operators, expression, mapToFunc) => pipeParsers([
  sequenceOf([
    many(whitespaced(str(operators[0]))),
    expression
  ]),
  mapTo(([operators, expression]) => {
    if (operators.length > 0) {
      const arr = operators.reduce((acc, operator) => {
        return acc == null ? [operator, expression] : [operator, acc]
      }, null)
      return mapToFunc(arr)
    }
    return expression
  })
])

const rightAssociative = (operators, expression, mapToFunc) => pipeParsers([
  sequenceOf([
    expression,
    many(
      sequenceOf([
        whitespaced(choice(operators.map(op => str(op)))),
        expression
      ])
    )
  ]),
  mapTo(args => {
    const flat = args.flat(Infinity)
    // @TODO: Can we use Array.reduce here?
    while (flat.length >= 3) {
      const operand1 = flat.pop()
      const operator = flat.pop()
      const operand = flat.pop()
      flat.push([operator, operand, operand1])
    }
    return mapToFunc(flat.flat())
  })
])

const leftAssociative = (operators, expression, mapToFunc) => pipeParsers([
  sequenceOf([
    expression,
    many(
      sequenceOf([
        whitespaced(anyOfString(operators.join(""))),
        expression
      ])
    )
  ]),
  mapTo(args => {
    const flat = args.flat(Infinity)
    // @TODO: Can we use Array.reduce here?
    while (flat.length >= 3) {
      const operand = flat.shift()
      const operator = flat.shift()
      const operand1 = flat.shift()
      flat.unshift([operator, operand, operand1])
    }
    return mapToFunc(flat.flat())
  })
])

const mapTypeToFunctionName = {
  "PRE": prefix,
  //"POST": postfix,
  "RIGHT": rightAssociative,
  "LEFT": leftAssociative
}

// type table: [ {
//   type: "PRE" / "POST" / "RIGHT" / "LEFT",
//   operators: STRING | [STRING],
//   mapTo: Function
// } ]
// type base: Parser

const createOperatorsParser = (table, baseExpression) => {

  // @TODO: type check level.type, level.operators, baseExpression

  const expression = recursiveParser(() =>
    choice([
      whitespaced(baseExpression),
      between(whitespaced(char("(")))(whitespaced(char(")")))(parser)
    ])
  )

  const parser = table.reduce((parser, level) => {
    const func = mapTypeToFunctionName[level.type]
    const operators = Array.isArray(level.operators) ? level.operators : [level.operators]
    return func(operators, parser, level.mapTo)
  }, expression)

  return parser
}

module.exports = createOperatorsParser
