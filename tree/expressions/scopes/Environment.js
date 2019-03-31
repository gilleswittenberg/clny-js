const buildInTypes = require("../../../buildins/types")
const buildInKeys = require("../../../buildins/keys")

// @TODO: access parent environments (., .., ...)
// @TODO: numParentEnvironments

// @TODO: Move to dir `/utils`
const last = arr => arr[arr.length - 1]

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
    Object.keys(obj).forEach(key => {
      environment.set(key, obj[key])
    })
    return environment
  }

  has (key) {
    return this.get(key) !== undefined
  }

  // @TODO: get (key, unwrap = true)
  // @TODO: get (key, type = "Type" | "PluralType" | "Expression")
  get (key) {
    const value = this.keys[key]
    if (value !== undefined) return last(value)
    const pluralType = this.getPluralType(key)
    if (pluralType !== undefined) {
      pluralType.isPluralType = true
      return pluralType
    }
    return this.parentEnvironment != null ? this.parentEnvironment.get(key) : undefined
  }

  getPluralType (key) {
    return Object.keys(this.keys)
      .map(key => last(this.keys[key]))
      .filter(value => value.isType === true)
      .find(type => type.value.pluralName === key)
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
