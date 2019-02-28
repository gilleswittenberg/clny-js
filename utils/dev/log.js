const { inspect } = require("util")
const options = { showHidden: false, depth: null }
const log = obj => console.log(inspect(obj, options)) || obj
module.exports = log
