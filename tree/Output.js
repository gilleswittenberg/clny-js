class Output {

  constructor () {
    this.shouldLog = false
    this.clear()
  }

  setShouldLog (shouldLog) {
    this.shouldLog = shouldLog
    return this
  }

  print (verbosity, value, type = "UNKNOWN TYPE") {
    const str =
      verbosity === "print" ? value :
        verbosity === "log" ? new Date().toLocaleString() + " " + value :
          verbosity === "debug" ? type + " " + value :
            (() => { throw new Error ("Invalid Print Statement") })()
    this.lines.push(str)
    if (this.shouldLog) {
      // eslint-disable-next-line no-console
      console.log(str)
    }
    return str
  }

  read () {
    return this.lines.join("\n") + "\n"
  }

  clear () {
    this.lines = []
    return this
  }
}

// Singleton
module.exports = new Output()
