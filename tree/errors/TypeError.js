const ClnyError = require("./ClnyError")

class TypeError extends ClnyError {

  constructor (lineNumber, message) {
    super(lineNumber, message)
    this.errorType = "TypeError"
  }
}

module.exports = TypeError
