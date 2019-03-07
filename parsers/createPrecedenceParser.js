// @LINK: https://github.com/jneen/parsimmon/blob/master/examples/math.js
// @TODO: postfix

const {
  Parser,
  str,
  sequenceOf,
  many,
  choice,
  pipeParsers,
  recursiveParser,
  between,
  takeLeft,
  mapTo
} = require("arcsecond")

const {
  whitespace,
  whitespaced
} = require("./convenience/whitespace")

const {
  leftParens,
  rightParens
} = require("./convenience/tokens")

const toArray = require("../utils/toArray")

const createOperatorsParser = (operators, whitespaceRequired) => {
  const operatorParser = operator => operator instanceof Parser ? operator : str(operator)
  return whitespaceRequired ?
    choice(operators.map(op => takeLeft(operatorParser(op))(whitespace))) :
    // @TODO: Only whitespace on right side
    whitespaced(choice(operators.map(op => operatorParser(op))))
}

const prefix = (expression, operatorsParser, mapToFunc) => {
  return pipeParsers([
    sequenceOf([
      many(operatorsParser),
      expression
    ]),
    mapTo(([operators, expression]) => {
      if (operators.length === 0) return expression
      const arr = operators.reverse().reduce((acc, operator) => [operator, acc], expression)
      return mapToFunc(arr)
    })
  ])
}

const rightAssociative = (expression, operatorsParser, mapToFunc) => pipeParsers([
  sequenceOf([
    expression,
    many(
      sequenceOf([
        operatorsParser,
        expression
      ])
    )
  ]),
  mapTo(([expression, expressions]) => {
    if (expressions.length === 0) return expression
    const flat = [expression, expressions].flat(Infinity)
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

const leftAssociative = (expression, operatorsParser, mapToFunc) => pipeParsers([
  sequenceOf([
    expression,
    many(
      sequenceOf([
        operatorsParser,
        expression
      ])
    )
  ]),
  mapTo(([expression, expressions]) => {
    if (expressions.length === 0) return expression
    const flat = [expression, expressions].flat(Infinity)
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
  "PREFIX": prefix,
  //"POSTFIX": postfix,
  "RIGHT_ASSOCIATIVE": rightAssociative,
  "LEFT_ASSOCIATIVE": leftAssociative
}

// type table: [ {
//   type: "PRE" / "POST" / "RIGHT" / "LEFT",
//   operators: STRING | [STRING],
//   mapTo: Function
// } ]
// type base: Parser

const createPrecedenceParser = (table, baseExpression) => {

  // @TODO: type check level.type, level.operators, baseExpression

  const expression = recursiveParser(() =>
    choice([
      whitespaced(baseExpression),
      between(whitespaced(leftParens))(whitespaced(rightParens))(parser)
    ])
  )

  const parser = table.reduce((parser, level) => {
    const func = mapTypeToFunctionName[level.type]
    const operators = toArray(level.operators)
    const whitespaceRequired = level.whitespaceRequired || false
    const operatorsParser = createOperatorsParser(operators, whitespaceRequired)
    return func(parser, operatorsParser, level.mapTo, whitespaceRequired, level.keyParser)
  }, expression)

  return parser
}

module.exports = createPrecedenceParser
