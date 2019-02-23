const Expression = require("./Expression")
const Assignment = require("./Assignment")
const Statement = require("./Statement")

class Scope {

  constructor (objects = []) {
    this.objects = objects
  }

  evaluate () {
    this.objects.forEach(object => object.evaluate())

    if (this.isEmpty()) {
      return null
    }

    if (this.hasOnlyAssignments()) {
      return this.objects.reduce((acc, object) => {
        acc[object.keys[0]] = object.expressions[0].value.value
        return acc
      },
      {})
    }

    if (this.hasOnlyExpressions()) {
      return this.objects.map(object => {
        if (object instanceof Expression) return object.value.value
        // @TODO: multiple keys (aliases)
        if (object instanceof Assignment) return { [object.keys[0]]: object.expressions[0].value.value }
      })
    }

    // return statement
    return this.objects.find(object => object instanceof Statement).values()
  }

  isEmpty () {
    return this.objects.length === 0
  }

  hasOnlyAssignments () {
    return this.objects.every(object => object instanceof Assignment)
  }

  hasOnlyExpressions () {
    return this.objects.every(object => object instanceof Expression || object instanceof Assignment)
  }
}

module.exports = Scope
