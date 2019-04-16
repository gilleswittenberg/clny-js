const ClnyError = require("./ClnyError")

class EvaluationError extends ClnyError {

  constructor (lineNumber, message) {
    super(lineNumber, message)
    this.errorType = "EvaluationError"
  }
}

module.exports = EvaluationError
