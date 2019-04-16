class ClnyError extends Error {
  constructor (lineNumber, message) {
    super(message)
    this.lineNumber = lineNumber
    this.errorType = "ClnyError"
  }
}

module.exports = ClnyError
