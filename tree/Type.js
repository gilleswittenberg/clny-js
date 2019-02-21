class Type {

  // @TODO: fullName e.g. (key: Name)

  constructor (name, options, types, inputTypes, keys) {

    this.name = name != null ? name :
      notEmpty(options) ? optionsToName(options) :
        notEmpty(types) || notEmpty(inputTypes) ? typesToName(types, inputTypes) :
          null

    this.options =
      isEmpty(options) ? [this] :
        toArray(options).map(nameToType)
    this.types =
      isEmpty(types) ? this.options :
        toArray(types).map(nameToType)
    this.isPlural = this.types.length > 1

    this.inputTypes =
      notEmpty(inputTypes) ? toArray(inputTypes).map(nameToType) :
        []
    this.isFunction = this.inputTypes > 0

    this.keys = toArray(keys)
  }

}

module.exports = Type

const isEmpty = arr => arr == null || arr.length === 0
const notEmpty = arr => isEmpty(arr) === false
const toArray = arr => Array.isArray(arr) ? arr : arr != null ? [arr] : []

const join = (arr, sep) => toArray(arr).join(sep)
const optionsToName = arr => join(arr, " | ")
const typesToName = (types, inputTypes) => {
  const sep = ", "
  const arrow = " -> "
  return (notEmpty(inputTypes) ? join(inputTypes, sep) + arrow : "") + join(types, sep)
}

const nameToType = name => new Type(name)
