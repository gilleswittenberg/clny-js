module.exports = class Line {

  constructor (chars, lineNumber, indention = 0) {
    this.chars = chars
    this.lineNumber = lineNumber
    this.indention = indention
    this.isEmpty = chars.trim() === ""
  }
}
