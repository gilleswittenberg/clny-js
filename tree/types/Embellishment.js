const TypeError = require("../errors/TypeError")

const embellishmentsMap = {
  "!": "Impure",
  "?": "Optional",
  "^": "Throwable",
  "@": "Async",
  "$": "Mutable"
}

const embellishments = Object.keys(embellishmentsMap)
const properties = embellishments.map(embellishment => embellishmentsMap[embellishment])

class Embellishment {

  constructor (str) {
    const property =
      properties.includes(str) ? str :
        embellishments.includes(str) ? embellishmentsMap[str] :
          (() => { throw new TypeError(null, str + " is not a valid Embellishment property or postfix") })()
    this.property = property
  }
}

module.exports = Embellishment
