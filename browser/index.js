const { parse, toPromise } = require("arcsecond")
const root = require("../parsers/root")

const run = text => {

  const rootScope = root()

  const evaluate = rootScope => rootScope.evaluate()
  const output = result => console.info(result)

  const onSuccess = rootScope => output(evaluate(rootScope))
  const onError = err => console.error(err)

  toPromise(parse(rootScope)(text))
    .then(onSuccess)
    .catch(onError)
}

const button = document.getElementsByTagName("button")[0]
const textarea = document.getElementsByTagName("textarea")[0]
button.addEventListener("click", () => run(textarea.value))
