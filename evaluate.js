module.exports = expressions => {

  const obj = expressions.reduce((acc, expression) => {
    if (expression.keys.length) {
      expression.keys.forEach(key => {
        acc[key] = expression.value
      })
    }
    return acc
  }, {})

  return obj
}
