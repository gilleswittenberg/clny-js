const ScopeLine = require("../tree/text/ScopeLine")
const ScopeOpener = require("../tree/text/ScopeOpener")
const TypeOpener = require("../tree/text/TypeOpener")
const TypeScope = require("../tree/text/TypeScope")
const TypeConstructor = require("../tree/types/TypeConstructor")
const Type = require("../tree/types/Type")
const Gibberish = require("../tree/text/Gibberish")
const Function = require("../tree/expressions/scopes/Function")
const FunctionScope = require("../tree/expressions/scopes/FunctionScope")
const Assignment = require("../tree/expressions/Assignment")
const ParseError = require("../tree/errors/ParseError")

// @TODO: throw new Error ("Can only define type at root")
// @TODO: throw new Error ("Can only add TypeConstructor as property to type")
const mapLinesToScopeLines = lines => {

  const scopes = new ScopeLine()
  const currentIndices = []
  const lastScope = () => currentIndices.reduce((scopeLine, index) => scopeLine.getScopeLine(index), scopes)

  const pushToScope = line => {
    const scopeLine = new ScopeLine(line)
    const scope = lastScope()
    scope.addScopeLine(scopeLine)
  }

  const lastIndex = () => {
    const l = lastScope().numScopeLines
    return l > 0 ? l - 1 : 0
  }

  lines.forEach(line => {

    if (line.isEmpty) return

    const currentIndent = currentIndices.length
    const indents = line.indents

    // deeper
    if (indents > currentIndent) {
      // new scope
      currentIndices.push(lastIndex())
    }

    // higher
    if (indents < currentIndent) {
      const diff = currentIndent - indents
      for (let i = 0; i < diff; i++) {
        currentIndices.pop()
      }
    }

    // push to parent scope
    pushToScope(line)
  })

  return scopes.scopeLines
}

const filterComments = scopeLines => {
  const filterLine = scopeLine => {
    const line = scopeLine.line
    const scopeLines = scopeLine.scopeLines
    // clear child line
    if (line.isComment) return null
    scopeLine.scopeLines = scopeLines.map(filterLine).filter(scopeLine => scopeLine != null)
    return scopeLine
  }
  return scopeLines.map(filterLine).filter(scopeLine => scopeLine != null)
}

const checkGibberish = scopeLines => {
  const check = scopeLine => {
    const line = scopeLine.line
    const scopeLines = scopeLine.scopeLines
    if (line.parsedContent instanceof Gibberish) {
      throw new ParseError (line.lineNumber, "Invalid characters")
    }
    scopeLines.forEach(check)
  }
  scopeLines.forEach(check)
  return scopeLines
}

const checkIndention = scopeLines => {
  const checkIndents = scopeLine => {
    const line = scopeLine.line
    const indents = line.indents
    const scopeLines = scopeLine.scopeLines
    scopeLines.forEach(scopeLine => {
      if (scopeLine.line.indents > indents + 1)
        throw new ParseError (scopeLine.line.lineNumber, "Invalid indention")
      checkIndents(scopeLine)
    })
  }
  scopeLines.forEach(checkIndents)
  return scopeLines
}

const checkScopeOpeners = scopeLines => {
  const checkScopeOpener = scopeLine => {
    const line = scopeLine.line
    const scopeLines = scopeLine.scopeLines
    if (scopeLines.length > 0 && line.canOpenScope === false)
      throw new ParseError (line.lineNumber, "Can not open scope")
    if (scopeLines.length === 0 && line.parsedContent instanceof ScopeOpener) {
      throw new ParseError (scopeLine.line.lineNumber, "Scope opened without adding expressions")
    }
    scopeLines.forEach(checkScopeOpener)
  }
  scopeLines.forEach(checkScopeOpener)
  return scopeLines
}

const mapScopeLinesToScopes = (Scope, scopeLines) => {

  const rootScope = new Scope()

  const addToScope = (scope, content) => {
    if (content instanceof TypeConstructor) {
      scope.addType(content.name, content.type)
    }
    else if (content instanceof TypeScope) {
      const type = new Type(content.name, null, content.types, null, null, null, content.properties)
      scope.addType(content.name, type)
    }
    else if (scope instanceof TypeScope) {
      if (content.expressions[0] instanceof Type) {
        // @TODO: Set keys from Assignment => Type
        scope.addType(content.expressions[0])
      } else {
        scope.addProperty(content)
      }
    }
    else {
      scope.addExpressions(content)
    }
  }

  const scopeLineToExpressionsOrScope = scopeLine => {

    const line = scopeLine.line
    const content = line.parsedContent
    const scopeLines = scopeLine.scopeLines

    // expression(s)
    if (scopeLine.isEmpty) return content

    // type
    if (content instanceof TypeOpener) {
      const scope = new TypeScope(content.name)
      const properties = scopeLines.map(scopeLine => scopeLine.line.parsedContent)
      properties.forEach(property => addToScope(scope, property))
      return scope
    }

    if (Scope == FunctionScope) {
      const scope = new Scope()
      const expressions = scopeLines.map(scopeLineToExpressionsOrScope)
      expressions.forEach(expression => addToScope(scope, expression))
      return new Assignment(content.key, new Function(content.functionType, scope))
    }

    // new scope
    const scope = new Scope(content.key)
    const expressions = scopeLines.map(scopeLineToExpressionsOrScope)
    expressions.forEach(expression => addToScope(scope, expression))
    return scope
  }

  scopeLines.forEach(scopeLine => {
    addToScope(rootScope, scopeLineToExpressionsOrScope(scopeLine))
  })

  return rootScope
}

const linesToScopes = (Scope, lines) => {
  // @TODO: Improve chaining / composition
  return mapScopeLinesToScopes(
    Scope,
    checkScopeOpeners(
      checkIndention(
        checkGibberish(
          filterComments(
            mapLinesToScopeLines(lines))))))
}

module.exports = linesToScopes
