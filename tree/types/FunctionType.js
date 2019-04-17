const toArray = require("../../utils/toArray")

// @TODO: Can we use Type instead of this wrapper class
class FunctionType {

  constructor (inputs, returnType) {
    this.inputs = toArray(inputs)
    this.returnType = returnType
  }
}

module.exports = FunctionType
