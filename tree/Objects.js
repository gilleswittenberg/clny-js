const Object = require("./Object")

class Objects extends Object {

  constructor (objects) {
    super()
    this.objects = objects // Objects
    this.type = "Plural"
    this.isEvaluated = false
  }

  evaluate () {
    this.objects.forEach(object => object.evaluate())
    this.isEvaluated = true
    return this.objects
  }
}

module.exports = Objects
