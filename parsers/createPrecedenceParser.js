// @LINK: https://github.com/jneen/parsimmon/blob/master/examples/math.js

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

const createOperatorsParser = (operators, allowWhitespace = true) => {
  const operatorParser = operator => operator instanceof Parser ? operator : str(operator)
  // @TODO: Extract `choice(operators.map(op => operatorParser(op)))`
  switch (allowWhitespace) {
  case "REQUIRED":
    return choice(operators.map(op => takeLeft(operatorParser(op))(whitespace)))
  case true:
    return whitespaced(choice(operators.map(op => operatorParser(op))))
  case false:
    return choice(operators.map(op => operatorParser(op)))
  default:
    throw new Error ("Invalid whitespace argument")
  }
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

const postfix = (expression, operatorsParser, mapToFunc) => {
  return pipeParsers([
    sequenceOf([
      expression,
      many(operatorsParser)
    ]),
    mapTo(([expression, operators]) => {
      if (operators.length === 0) return expression
      const arr = operators.reduce((acc, operator) => [operator, acc], expression)
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
  "POSTFIX": postfix,
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

  const expression = recursiveParser(() =>
    choice([
      baseExpression,
      between(leftParens)(rightParens)(whitespaced(parser))
    ])
  )

  const parser = table.reduce((parser, level) => {
    const func = mapTypeToFunctionName[level.type]
    const operators = toArray(level.operators)
    const operatorsParser = createOperatorsParser(operators, level.whitespace)
    return func(parser, operatorsParser, level.mapTo)
  }, expression)

  return parser
}

module.exports = createPrecedenceParser
