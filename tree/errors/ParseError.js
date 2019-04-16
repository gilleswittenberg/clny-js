const ClnyError = require("./ClnyError")

class ParseError extends ClnyError {

  constructor (lineNumber, message) {
    super(lineNumber, message)
    this.errorType = "ParseError"
  }
}

module.exports = ParseError
