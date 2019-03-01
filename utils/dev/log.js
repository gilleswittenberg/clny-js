const { inspect } = require("util")
const options = { showHidden: false, depth: null }
const log = (...obj) => {
  // eslint-disable-next-line no-console
  obj.forEach(o => console.log(inspect(o, options)))
  return obj.length === 1 ? obj[0] : obj
}
module.exports = log
