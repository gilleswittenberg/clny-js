const buildInTypes = require("../../../buildins/types")
const buildInKeys = require("../../../buildins/keys")
const { last } = require("../../../utils/arrayLast")

// @TODO: access parent environments (., .., ...)
// @TODO: numParentEnvironments

class Environment {

  constructor (parentEnvironment) {
    this.parentEnvironment = parentEnvironment
    this.keys = {}
    if (parentEnvironment == null) {
      this.setBuildIns(buildInTypes, true)
      this.setBuildIns(buildInKeys)
    }
  }

  clone () {
    return new Environment(this)
  }

  setArgs (obj) {
    const environment = this.clone()
    Object.keys(obj).forEach(key => environment.set(key, obj[key]))
    return environment
  }

  has (key) {
    return this.get(key) !== undefined
  }

  // @TODO: get (key, unwrap = true)
  // @TODO: get (key, type = "Type" | "Expression")
  get (key) {
    const value = this.keys[key]
    if (value !== undefined) return last(value)
    return this.parentEnvironment != null ? this.parentEnvironment.get(key) : undefined
  }

  set (key, object, isType = false) {
    const value = {
      key,
      value: object,
      isType,
      isKey: !isType
    }
    if (this.keys[key] === undefined) this.keys[key] = []
    this.keys[key].push(value)
    return value
  }

  setBuildIns (obj, isType = false) {
    Object.keys(obj).forEach(key => this.set(key, obj[key], isType))
  }
}

module.exports = Environment
