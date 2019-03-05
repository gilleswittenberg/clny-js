class Indent {
  constructor (indents) {
    this.level = indents.length
    this.chars = indents.flat().join("")
  }
}

module.exports = Indent
