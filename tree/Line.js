module.exports = class Line {

  constructor (chars, lineNumber, indents = 0) {
    this.chars = chars
    this.lineNumber = lineNumber
    this.indents = indents
    this.isEmpty = typeof chars === "string" && chars.trim() === ""
  }
}
