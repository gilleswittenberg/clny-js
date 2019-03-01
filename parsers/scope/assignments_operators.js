const {
  digits,
  recursiveParser,
  choice,
  sequenceOf,
  many1,
  sepBy1,
  pipeParsers,
  mapTo,
  many,
  takeLeft,
  possibly
} = require("arcsecond")

const log = require("../../utils/dev/log")

const {
  colon,
  comma
} = require("../convenience/tokens")

const {
  whitespaced
} = require("../convenience/whitespace")

const {
  wrappedInParentheses
} = require("../convenience/convenience")

const key = require("./key")

class Object {
  constructor (value) {
    if (value !== undefined) {
      this.value = value
    }
  }
}
class Expression extends Object {}
class Identity extends Object {}
class Assignment extends Object {
  constructor (key, objects) {
    super()
    this.objects = objects
    this.key = key
  }
}

const scalar = pipeParsers([digits, mapTo(s => new Expression(s))])
const identity = pipeParsers([key, mapTo(s => new Identity(s))])
const expression = wrappedInParentheses(choice([
  scalar,
  identity
]))

const keyColon = takeLeft(key)(whitespaced(colon))

const object = recursiveParser(() => wrappedInParentheses(pipeParsers([
  sequenceOf([
    many(keyColon),
    choice([
      expression,
      object
    ])
  ]),
  mapTo(([keys, expression]) => {
    if (keys.length > 0) {
      return keys.reverse().reduce((acc, key) => new Assignment(key, [acc]), expression)
    }
    return expression
  })
])))

const objects = wrappedInParentheses(sepBy1(whitespaced(comma))(object))

const assignment = pipeParsers([
  sequenceOf([
    possibly(keyColon),
    objects
  ]),
  mapTo(([key, objects]) => key != null ? new Assignment(key, objects) : objects)
])

const assignmentOrObjects = choice([
  assignment,
  objects
])

module.exports = {
  Expression,
  Assignment,
  Identity,
  assignment
}
