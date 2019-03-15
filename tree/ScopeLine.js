
// Tree node = line, children = ScopeLines
class ScopeLine {

  constructor (line) {
    this.line = line || null
    this.scopeLines = []
    this.isEmpty = true
    this.numScopeLines = 0
  }

  addScopeLine (scopeLine) {
    this.scopeLines.push(scopeLine)
    this.isEmpty = false
    this.numScopeLines = this.scopeLines.length
  }

  getScopeLine (index) {
    return this.scopeLines[index]
  }
}

module.exports = ScopeLine
