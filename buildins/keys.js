const Statement = require("../tree/expressions/statements/Statement")
const ForStatement = require("../tree/expressions/statements/ForStatement")
const ConditionalStatement = require("../tree/expressions/statements/ConditionalStatement")

const keys = {
  return: function buildInStatement (expressions) { return new Statement ("return", expressions) },

  for:    function buildInStatement (expressions) { return new ForStatement (expressions) },

  if:     function buildInStatement (expressions) { return new ConditionalStatement("if", expressions) },
  elseif: function buildInStatement (expressions) { return new ConditionalStatement("elseif", expressions) },
  else:   function buildInStatement (expressions) { return new ConditionalStatement("else", expressions) },

  print:  function buildInStatement (expressions) { return new Statement("print", expressions) },
  log:    function buildInStatement (expressions) { return new Statement("log", expressions) },
  debug:  function buildInStatement (expressions) { return new Statement("debug", expressions) }
}

module.exports = keys
