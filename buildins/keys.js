const Statement = require("../tree/expressions/Statement")
const ForStatement = require("../tree/expressions/ForStatement")
const ConditionalStatement = require("../tree/expressions/ConditionalStatement")

const keys = {
  return: expressions => new Statement ("return", expressions),

  for: expressions => new ForStatement (expressions),

  if: expressions => new ConditionalStatement("if", expressions),
  elseif: expressions => new ConditionalStatement("elseif", expressions),
  else: expressions => new ConditionalStatement("else", expressions),

  print: expressions => new Statement("print", expressions),
  log: expressions => new Statement("log", expressions),
  debug: expressions => new Statement("debug", expressions)
}

module.exports = keys
