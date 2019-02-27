const Expression = require("./Expression")
const Assignment = require("./Assignment")
const Statement = require("./Statement")

const isExpression = object => object instanceof Expression
const isAssignment = object => object instanceof Assignment
const isExpressionOrAssignment = object => isExpression(object) || isAssignment(object)

class Scope {

  constructor (objects = []) {
    this.objects = objects
  }

  evaluate () {

    if (this.isEmpty()) return null
    if (this.hasOnlyExpressions()) return this.evaluateDataScope()
    return this.evaluateFunctionScope()
  }

  evaluateDataScope () {

    const objects = this.objects.filter(isExpressionOrAssignment)
    objects.forEach(object => object.evaluate())

    // create map e.g. ({ k: 5, l: 6 })
    if (this.hasOnlyAssignments()) {
      return objects.reduce((acc, object) => {
        // @TODO: multiple keys (aliases)
        acc[object.keys[0]] = object.expressions[0].value.value
        return acc
      },
      {})
    }

    // create array e.g. ([5, 6, { k: 7 }])
    if (this.hasOnlyExpressions()) {
      return objects.map(object => {
        if (isExpression(object)) return object.value.value
        // @TODO: multiple keys (aliases)
        if (isAssignment(object)) return { [object.keys[0]]: object.expressions[0].value.value }
      })
    }
  }

  evaluateFunctionScope () {

    const isLast = (index, arr) => arr.length - 1 === index

    const initialScope = { hasReturned: false, returnValue: null, keys: {} }

    const evaluatedScope = this.objects.reduce((scope, object, index, arr) => {
      if (scope.hasReturned) return scope
      object.evaluate()
      if (object instanceof Assignment) {
        object.keys.forEach(key => scope.keys[key] = object.expressions)
      }
      if (object instanceof Statement || isLast(index, arr)) {
        scope.returnValue = object.values()
        scope.hasReturned = true
      }
      return scope
    }, initialScope)
    
    return evaluatedScope.returnValue
  }

  isEmpty () {
    return this.objects.length === 0
  }

  hasOnlyAssignments () {
    return this.objects.every(isAssignment)
  }

  hasOnlyExpressions () {
    return this.objects.every(object => isExpression(object) || isAssignment(object))
  }
}

module.exports = Scope
