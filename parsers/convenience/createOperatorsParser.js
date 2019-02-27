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
    // @TODO: It seems leftAssociative are also parser results are also being mapped through here
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
    const operations = flat.reduce((acc, cur) => {
      if (acc.length === 3) {
        return [cur, acc]
      } else if (acc.length === 2) {
        return acc.concat(cur)
      } else if (acc.length === 1) {
        return [cur].concat(acc)
      } else if (acc.length === 0) {
        return [cur]
      }
    }, [])
    return mapToFunc(operations)
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