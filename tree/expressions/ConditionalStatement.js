const Statement = require("./Statement")

const isIf = name => ["if", "elseif"].includes(name)

class ConditionalStatement extends Statement {

  evaluate (env) {

    if (this.isEvaluated) return this.value

    let condition, consequent

    if (isIf(this.name)) {
      if (this.expressions.length !== 2) throw "if / elseif statement should have 2 arguments"
      condition = this.expressions[0]
      condition.evaluate(env)
      if (condition.type !== "Boolean") throw "if / elseif statement's first argument should be a Boolean"
      consequent = this.expressions[1]
    } else {
      if (this.expressions.length !== 1) throw "else statement should have 1 argument"
      consequent = this.expressions[0]
    }

    if (consequent.type !== "Scope") throw "if / elseif / else statement's last argument should be a Scope"

    if (isIf(this.name)) {
      this.value = condition.value === true ? [true, consequent.evaluate(env)] : [false, null]
    } else {
      this.value = consequent.evaluate(env)
    }
    this.isEvaluated = true
    return this.value
  }

  doNotEvaluate (previousValue) {
    this.isEvaluated = true
    if (isIf(this.name)) {
      this.value = [true, previousValue]
    } else {
      this.value = previousValue
    }
    return this.value
  }
}

module.exports = ConditionalStatement
