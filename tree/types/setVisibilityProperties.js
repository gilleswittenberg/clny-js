const setVisibilityProperties = (properties, visibilty = "CONVENIENCE") =>
  Object.keys(properties).reduce((acc, key) => {
    const property = properties[key]
    acc[key] = { visibilty, property }
    return acc
  }, {})

module.exports = setVisibilityProperties
