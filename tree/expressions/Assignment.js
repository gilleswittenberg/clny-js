const Expression = require("./Expression")
const toArray = require("../../utils/toArray")

class Assignment extends Expression {

  constructor (keys, expressions) {
    super("Assignment", expressions)
    this.keys = toArray(keys)
  }

  typeCheck () {
    this.expressions.forEach(expression => expression.typeCheck())
    return this.type
  }

  printTree () {
    const tree = super.printTree()
    tree.splice(1, 0, this.keys[0])
    return tree
  }
}

module.exports = Assignment
