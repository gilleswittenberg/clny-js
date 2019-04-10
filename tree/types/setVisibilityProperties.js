const setVisibilityProperties = (properties, visibility = "CONVENIENCE") =>
  Object.keys(properties).reduce((acc, key) => {
    const property = properties[key]
    acc[key] = { key, visibility, property }
    return acc
  }, {})

module.exports = setVisibilityProperties
