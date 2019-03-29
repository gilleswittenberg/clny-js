const reduceStringsToObject = (strings, map) =>
  strings.reduce((acc, str) => {
    acc[str] = map !== undefined ? map(str) : str
    return acc
  }, {})

module.exports = reduceStringsToObject
