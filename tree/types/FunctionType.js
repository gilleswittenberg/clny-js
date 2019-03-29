const toArray = require("../../utils/toArray")

class FunctionType {

  constructor (inputs, returnType) {
    this.inputs = toArray(inputs)
    this.returnType = returnType
  }
}

module.exports = FunctionType
