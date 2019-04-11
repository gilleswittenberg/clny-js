(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../parsers/root":26,"arcsecond":4}],2:[function(require,module,exports){
const Statement = require("../tree/expressions/statements/Statement")
const ForStatement = require("../tree/expressions/statements/ForStatement")
const ConditionalStatement = require("../tree/expressions/statements/ConditionalStatement")

const keys = {
  return: function buildInStatement (expressions) { return new Statement ("return", expressions) },

  for:    function buildInStatement (expressions) { return new ForStatement (expressions) },

  if:     function buildInStatement (expressions) { return new ConditionalStatement("if", expressions) },
  elseif: function buildInStatement (expressions) { return new ConditionalStatement("elseif", expressions) },
  else:   function buildInStatement (expressions) { return new ConditionalStatement("else", expressions) },

  print:  function buildInStatement (expressions) { return new Statement("print", expressions) },
  log:    function buildInStatement (expressions) { return new Statement("log", expressions) },
  debug:  function buildInStatement (expressions) { return new Statement("debug", expressions) }
}

module.exports = keys

},{"../tree/expressions/statements/ConditionalStatement":51,"../tree/expressions/statements/ForStatement":52,"../tree/expressions/statements/Statement":53}],3:[function(require,module,exports){
const reduceStringsToObject = require("../utils/reduceStringsToObject")
const Type = require("../tree/types/Type")

const pluralize = str => str + "s"

const types = [
  "Null",
  "Boolean",
  "Number",
  "String"
]

const buildInTypes = reduceStringsToObject(types, type => new Type(type, null, null, null, null, null, null, true))
const buildInPlurals = types.reduce((acc, name) => {
  const plural = pluralize(name)
  const type = new Type(plural, null, buildInTypes[name], null, null, null, Infinity)
  acc[plural] = type
  return acc
}, {})

module.exports = { ...buildInTypes, ...buildInPlurals }

},{"../tree/types/Type":63,"../utils/reduceStringsToObject":69}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = Parser;
exports.toValue = exports.toPromise = exports.takeLeft = exports.takeRight = exports.recursiveParser = exports.whitespace = exports.endOfInput = exports.skip = exports.possibly = exports.lookAhead = exports.anythingExcept = exports.everythingUntil = exports.between = exports.choice = exports.sepBy1 = exports.sepBy = exports.sequenceOf = exports.namedSequenceOf = exports.anyOfString = exports.letters = exports.letter = exports.digits = exports.digit = exports.regex = exports.str = exports.char = exports.leftMapTo = exports.mapTo = exports.many1 = exports.many = exports.succeedWith = exports.fail = exports.decide = exports.parse = exports.tapParser = exports.composeParsers = exports.pipeParsers = void 0;

var _data = require("data.either");

function Parser(p) {
  this.p = p;
}

;

Parser.prototype.run = function Parser$run(targetString) {
  return this.p((0, _data.Right)([0, targetString, null])).map(result => {
    return result[2];
  });
};

Parser.prototype['fantasy-land/map'] = function Parser$map(fn) {
  const that = this;
  return new Parser(function Parser$map$state(state) {
    return that.p(state).map(function Parser$map$state$map([i, s, v]) {
      return [i, s, fn(v)];
    });
  });
};

Parser.prototype['fantasy-land/chain'] = function Parser$chain(fn) {
  const that = this;
  return new Parser(function Parser$chain$state(state) {
    return that.p(state).chain(function Parser$chain$chain([i, s, v]) {
      return fn(v).p((0, _data.Right)([i, s, v]));
    });
  });
};

Parser.prototype['fantasy-land/ap'] = function Parser$ap(parserOfFunction) {
  const that = this;
  return new Parser(function Parser$ap$state(state) {
    return parserOfFunction.p(state).chain(function Parser$ap$chain([_, __, fn]) {
      return that.p(state).map(function Parser$ap$chain$map([i, s, v]) {
        return [i, s, fn(v)];
      });
    });
  });
};

Parser.prototype.leftMap = function Parser$leftMap(fn) {
  const that = this;
  return new Parser(function Parser$leftMap$state(state) {
    return that.p(state).leftMap(function Parser$leftMap$state$leftMap([i, e]) {
      return [i, fn(e, i)];
    });
  });
};

Parser.prototype.map = Parser.prototype['fantasy-land/map'];
Parser.prototype.ap = Parser.prototype['fantasy-land/ap'];
Parser.prototype.chain = Parser.prototype['fantasy-land/chain'];

Parser['fantasy-land/of'] = function (x) {
  return new Parser(state => {
    return state.map(([i, s]) => [i, s, x]);
  });
};

Parser.of = Parser['fantasy-land/of']; //           pipeParsers :: [Parser * * *] -> Parser * * *

const pipeParsers = function pipeParsers(parsers) {
  return new Parser(function pipeParsers$state(state) {
    let nextState = state;

    for (const parser of parsers) {
      nextState = parser.p(nextState);
    }

    return nextState;
  });
}; //           composeParsers :: [Parser * * *] -> Parser * * *


exports.pipeParsers = pipeParsers;

const composeParsers = function composeParsers(parsers) {
  return new Parser(function composeParsers$state(state) {
    return pipeParsers([...parsers].reverse()).p(state);
  });
}; //           tapParser :: (a => void) -> Parser e a a


exports.composeParsers = composeParsers;

const tapParser = function tapParser(fn) {
  return new Parser(function tapParser$state(state) {
    fn(state.value);
    return state;
  });
}; //           parse :: Parser e a b -> String -> Either e b


exports.tapParser = tapParser;

const parse = function parse(parser) {
  return function parse$targetString(targetString) {
    return parser.run(targetString);
  };
}; //           decide :: (a -> Parser e b c) -> Parser e b c


exports.parse = parse;

const decide = function decide(fn) {
  return new Parser(function decide$state(state) {
    return state.chain(function decide$state$chain([_, __, v]) {
      const parser = fn(v);
      return parser.p(state);
    });
  });
}; //           fail :: String -> Parser String a b


exports.decide = decide;

const fail = function fail(errorMessage) {
  return new Parser(function fail$state(state) {
    return state.chain(function fail$state$chain([i]) {
      return (0, _data.Left)([i, errorMessage]);
    });
  });
}; //           succeedWith :: b -> Parser e a b


exports.fail = fail;

const succeedWith = function succeedWith(x) {
  return new Parser(function succeedWith$state(state) {
    return state.map(function succeedWith$state$map([i, s]) {
      return [i, s, x];
    });
  });
}; //           many :: Parser e a b -> Parser e a [b]


exports.succeedWith = succeedWith;

const many = function many(parser) {
  return new Parser(function many$state(state) {
    return state.chain(function many$state$chain(innerState) {
      const results = [];
      let nextState = innerState;

      while (true) {
        const out = parser.p((0, _data.Right)(nextState));

        if (out.isLeft) {
          break;
        } else {
          nextState = out.value;
          results.push(nextState[2]);

          if (nextState[0] >= nextState[1].length) {
            break;
          }
        }
      }

      const [index, targetString] = nextState;
      return (0, _data.Right)([index, targetString, results]);
    });
  });
}; //           many1 :: Parser e a b -> Parser String a [b]


exports.many = many;

const many1 = function many1(parser) {
  return new Parser(function many1$state(state) {
    const res = many(parser).p(state);
    return res.chain(function many1$state$chain([index, targetString, value]) {
      if (value.length === 0) {
        return (0, _data.Left)([index, `ParseError 'many1' (position ${index}): Expecting to match at least one value`]);
      }

      return (0, _data.Right)([index, targetString, value]);
    });
  });
}; //           mapTo :: (a -> b) -> Parser e a b


exports.many1 = many1;

const mapTo = function mapTo(fn) {
  return new Parser(function mapTo$state(state) {
    return state.map(function mapTo$state$map([index, targetString, res]) {
      return [index, targetString, fn(res)];
    });
  });
}; //           leftMapTo :: ((e, Int) -> f) -> Parser f a b


exports.mapTo = mapTo;

const leftMapTo = fn => new Parser(state => {
  return state.leftMap(([index, errorString]) => {
    return [index, fn(errorString, index)];
  });
}); //           char :: Char -> Parser String a String


exports.leftMapTo = leftMapTo;

const char = function char(c) {
  if (!c || c.length !== 1) {
    throw new TypeError(`char must be called with a single character, but got ${c}`);
  }

  return new Parser(function char$state(state) {
    return state.chain(function char$state$chain([index, targetString]) {
      if (index < targetString.length) {
        if (targetString[index] === c) {
          return (0, _data.Right)([index + 1, targetString, c]);
        } else {
          return (0, _data.Left)([index, `ParseError (position ${index}): Expecting character '${c}', got '${targetString[index]}'`]);
        }
      }

      return (0, _data.Left)([index, `ParseError (position ${index}): Expecting character '${c}', but got end of input.`]);
    });
  });
}; //           str :: String -> Parser String a String


exports.char = char;

const str = function str(s) {
  if (!s || s.length < 1) {
    throw new TypeError(`str must be called with a string with length > 1, but got ${s}`);
  }

  return new Parser(function str$state(state) {
    return state.chain(function str$state$chain([index, targetString]) {
      const rest = targetString.slice(index);

      if (rest.length >= 1) {
        if (rest.startsWith(s)) {
          return (0, _data.Right)([index + s.length, targetString, s]);
        } else {
          return (0, _data.Left)([index, `ParseError (position ${index}): Expecting string '${s}', got '${rest.slice(0, s.length)}...'`]);
        }
      }

      return (0, _data.Left)([index, `ParseError (position ${index}): Expecting string '${s}', but got end of input.`]);
    });
  });
}; //           regex :: RegExp -> Parser String a String


exports.str = str;

const regex = function regex(re) {
  const typeofre = Object.prototype.toString.call(re);

  if (typeofre !== '[object RegExp]') {
    throw new TypeError(`regex must be called with a Regular Expression, but got ${typeofre}`);
  }

  if (re.toString()[1] !== '^') {
    throw new Error(`regex parsers must contain '^' start assertion.`);
  }

  return new Parser(function regex$state(state) {
    return state.chain(function regex$state$chain([index, targetString]) {
      const rest = targetString.slice(index);

      if (rest.length >= 1) {
        const match = rest.match(re);

        if (match) {
          return (0, _data.Right)([index + match[0].length, targetString, match[0]]);
        } else {
          return (0, _data.Left)([index, `ParseError (position ${index}): Expecting string matching '${re}', got '${rest.slice(0, 5)}...'`]);
        }
      }

      return (0, _data.Left)([index, `ParseError (position ${index}): Expecting string matching '${re}', but got end of input.`]);
    });
  });
}; //           digit :: Parser String a String


exports.regex = regex;
const digit = new Parser(function digit$state(state) {
  return state.chain(function digit$state$chain([index, targetString]) {
    const rest = targetString.slice(index);

    if (rest.length >= 1) {
      if (/[0-9]/.test(rest[0])) {
        return (0, _data.Right)([index + 1, targetString, rest[0]]);
      } else {
        return (0, _data.Left)([index, `ParseError (position ${index}): Expecting digit, got '${rest[0]}'`]);
      }
    }

    return (0, _data.Left)([index, `ParseError (position ${index}): Expecting digit, but got end of input.`]);
  });
}); //           digits :: Parser String a String

exports.digit = digit;
const digits = many1(digit).map(x => x.join('')); //           letter :: Parser String a String

exports.digits = digits;
const letter = new Parser(function letter$state(state) {
  return state.chain(function letter$state$chain([index, targetString]) {
    const rest = targetString.slice(index);

    if (rest.length >= 1) {
      if (/[a-zA-Z]/.test(rest[0])) {
        return (0, _data.Right)([index + 1, targetString, rest[0]]);
      } else {
        return (0, _data.Left)([index, `ParseError (position ${index}): Expecting letter, got ${rest[0]}`]);
      }
    }

    return (0, _data.Left)([index, `ParseError (position ${index}): Expecting letter, but got end of input.`]);
  });
}); //           letters :: Parser String a String

exports.letter = letter;
const letters = many1(letter).map(x => x.join('')); //           anyOfString :: String -> Parser String a String

exports.letters = letters;

const anyOfString = function anyOfString(s) {
  return new Parser(function anyOfString$state(state) {
    return state.chain(([index, targetString]) => {
      const rest = targetString.slice(index);

      if (rest.length >= 1) {
        if (s.includes(rest[0])) {
          return (0, _data.Right)([index + 1, targetString, rest[0]]);
        } else {
          return (0, _data.Left)([index, `ParseError (position ${index}): Expecting any of the string "${s}", got ${rest[0]}`]);
        }
      }

      return (0, _data.Left)([index, `ParseError (position ${index}): Expecting any of the string "${s}", but got end of input.`]);
    });
  });
}; //           namedSequenceOf :: [(String, Parser e a b)] -> Parser e a (StrMap b)


exports.anyOfString = anyOfString;

const namedSequenceOf = function namedSequenceOf(pairedParsers) {
  return new Parser(function namedSequenceOf$state(state) {
    return state.chain(() => {
      const results = {};
      let nextState = state;

      for (const [key, parser] of pairedParsers) {
        const out = parser.p(nextState);

        if (out.isLeft) {
          return out;
        } else {
          nextState = out;
          results[key] = out.value[2];
        }
      }

      const [i, s] = nextState.value;
      return (0, _data.Right)([i, s, results]);
    });
  });
}; //           sequenceOf :: [Parser e a b] -> Parser e a [b]


exports.namedSequenceOf = namedSequenceOf;

const sequenceOf = function sequenceOf(parsers) {
  return new Parser(function sequenceOf$state(state) {
    return state.chain(() => {
      const results = new Array(parsers.length);
      let nextState = state;

      for (let i = 0; i < parsers.length; i++) {
        const out = parsers[i].p(nextState);

        if (out.isLeft) {
          return out;
        } else {
          nextState = out;
          results[i] = out.value[2];
        }
      }

      const [i, s] = nextState.value;
      return (0, _data.Right)([i, s, results]);
    });
  });
}; //           sepBy :: Parser e a c -> Parser e a b -> Parser e a [b]


exports.sequenceOf = sequenceOf;

const sepBy = function sepBy(sepParser) {
  return function sepBy$valParser(valParser) {
    return new Parser(function sepBy$valParser$state(state) {
      return state.chain(function sepBy$valParser$state$chain() {
        let nextState = state;
        let left = null;
        const results = [];

        while (true) {
          const valState = valParser.p(nextState);
          const sepState = sepParser.p(valState);

          if (valState.isLeft) {
            left = valState;
            break;
          } else {
            results.push(valState.value[2]);
          }

          if (sepState.isLeft) {
            nextState = valState;
            break;
          }

          nextState = sepState;
        }

        if (left) {
          if (results.length === 0) {
            const [i, s] = state.value;
            return (0, _data.Right)([i, s, results]);
          }

          return left;
        }

        const [i, s] = nextState.value;
        return (0, _data.Right)([i, s, results]);
      });
    });
  };
}; //           sepBy1 :: Parser e a c -> Parser f a b  -> Parser String a [b]


exports.sepBy = sepBy;

const sepBy1 = function sepBy1(sepParser) {
  return function sepBy1$valParser(valParser) {
    return new Parser(function sepBy1$valParser$state(state) {
      return sepBy(sepParser)(valParser).p(state).chain(function sepBy1$valParser$state$chain([index, targetString, value]) {
        if (value.length === 0) {
          return (0, _data.Left)([index, `ParseError 'sepBy1' (position ${index}): Expecting to match at least one separated value`]);
        }

        return (0, _data.Right)([index, targetString, value]);
      });
    });
  };
}; //           choice :: [Parser e a *] -> Parser e a *


exports.sepBy1 = sepBy1;

const choice = function choice(parsers) {
  return new Parser(function choice$state(state) {
    let left = null;
    return state.chain(function choice$state$chain() {
      for (const parser of parsers) {
        const out = parser.p(state);

        if (out.isLeft) {
          if (!left || out.value[0] > left.value[0]) {
            left = out;
          }
        } else {
          return out;
        }
      }

      return left;
    });
  });
}; //           between :: Parser e a b -> Parser f a c -> Parser g a d -> Parser g a d


exports.choice = choice;

const between = function between(leftParser) {
  return function between$rightParser(rightParser) {
    return function between$rightParser(parser) {
      return sequenceOf([leftParser, parser, rightParser]).map(([_, x]) => x);
    };
  };
}; //           everythingUntil :: Parser e a b -> Parser String a c


exports.between = between;

const everythingUntil = function everythingUntil(parser) {
  return new Parser(state => {
    return state.chain(function everythingUntil$state(innerState) {
      const results = [];
      let nextState = state;

      while (true) {
        const out = parser.p(nextState);

        if (out.isLeft) {
          const [index, targetString] = nextState.value;
          const val = targetString[index];

          if (val) {
            results.push(val);
            nextState = (0, _data.Right)([index + 1, targetString, val]);
          } else {
            return (0, _data.Left)([nextState[0], `ParseError 'everythingUntil' (position ${nextState.value[0]}): Unexpected end of input.`]);
          }
        } else {
          break;
        }
      }

      const [i, s] = nextState.value;
      return (0, _data.Right)([i, s, results.join('')]);
    });
  });
}; //           anythingExcept :: Parser e a b -> Parser String a c


exports.everythingUntil = everythingUntil;

const anythingExcept = function anythingExcept(parser) {
  return new Parser(function anythingExcept$state(state) {
    return state.chain(([index, targetString]) => {
      const out = parser.p(state);

      if (out.isLeft) {
        return (0, _data.Right)([index + 1, targetString, targetString[index]]);
      }

      return (0, _data.Left)([index, `ParseError 'anythingExcept' (position ${index}): Matched '${out.value[2]}' from the exception parser`]);
    });
  });
}; //           lookAhead :: Parser e a b -> Parser e a b


exports.anythingExcept = anythingExcept;

const lookAhead = function lookAhead(parser) {
  return new Parser(function lookAhead$state(state) {
    return state.chain(function lookAhead$state$chain([i, s]) {
      const nextState = parser.p(state);
      return nextState.map(function lookAhead$state$chain$map([_, __, v]) {
        return [i, s, v];
      });
    });
  });
}; //           possibly :: Parser e a b -> Parser e a (b|null)


exports.lookAhead = lookAhead;

const possibly = function possibly(parser) {
  return new Parser(function possibly$state(state) {
    return state.chain(function possibly$state$chain([index, targetString]) {
      const nextState = parser.p(state);

      if (nextState.isLeft) {
        return (0, _data.Right)([index, targetString, null]);
      }

      return nextState;
    });
  });
}; //           skip :: Parser e a b -> Parser e a a


exports.possibly = possibly;

const skip = function skip(parser) {
  return new Parser(function skip$state(state) {
    return state.chain(function skip$state$chain([_, __, value]) {
      const nextState = parser.p(state);
      return nextState.map(([i, s]) => [i, s, value]);
    });
  });
}; //           endOfInput :: Parser e a b


exports.skip = skip;
const endOfInput = new Parser(function endOfInput$state(state) {
  return state.chain(function endOfInput$state$chain([index, targetString]) {
    if (index !== targetString.length) {
      return (0, _data.Left)([index, `ParseError 'endOfInput' (position ${index}): Expected end of input but got '${targetString.slice(index, index + 1)}'`]);
    }

    return (0, _data.Right)([index, targetString, null]);
  });
}); //           whitespace :: Parser e a String

exports.endOfInput = endOfInput;
const whitespace = many(anyOfString(' \n\t\r')).map(x => x.join('')); //           recursiveParser :: (() => Parser e a b) -> Parser e a b

exports.whitespace = whitespace;

const recursiveParser = function recursiveParser(parserThunk) {
  return new Parser(function recursiveParser$state(state) {
    return parserThunk().p(state);
  });
}; //           takeRight :: Parser e a b -> Parser f b c -> Parser f a c


exports.recursiveParser = recursiveParser;

const takeRight = lParser => rParser => pipeParsers([lParser, rParser]); //           takeLeft :: Parser e a b -> Parser f b c -> Parser e a b


exports.takeRight = takeRight;

const takeLeft = lParser => rParser => sequenceOf([lParser, rParser]).map(x => x[0]); //           toPromise :: Either a b -> Promise a b


exports.takeLeft = takeLeft;

const toPromise = result => {
  return result.cata({
    Left: x => Promise.reject(x),
    Right: x => Promise.resolve(x)
  });
}; //           toValue :: Either a b -> b


exports.toPromise = toPromise;

const toValue = result => {
  return result.cata({
    Left: ([index, x]) => {
      const e = new Error(x);
      e.parseIndex = index;
      throw e;
    },
    Right: x => x
  });
};

exports.toValue = toValue;

},{"data.either":6}],5:[function(require,module,exports){
// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @module lib/either
 */
module.exports = Either

// -- Aliases ----------------------------------------------------------
var clone         = Object.create
var unimplemented = function(){ throw new Error('Not implemented.') }
var noop          = function(){ return this                         }


// -- Implementation ---------------------------------------------------

/**
 * The `Either(a, b)` structure represents the logical disjunction between `a`
 * and `b`. In other words, `Either` may contain either a value of type `a` or
 * a value of type `b`, at any given time. This particular implementation is
 * biased on the right value (`b`), thus projections will take the right value
 * over the left one.
 *
 * This class models two different cases: `Left a` and `Right b`, and can hold
 * one of the cases at any given time. The projections are, none the less,
 * biased for the `Right` case, thus a common use case for this structure is to
 * hold the results of computations that may fail, when you want to store
 * additional information on the failure (instead of throwing an exception).
 *
 * Furthermore, the values of `Either(a, b)` can be combined and manipulated by
 * using the expressive monadic operations. This allows safely sequencing
 * operations that may fail, and safely composing values that you don't know
 * whether they're present or not, failing early (returning a `Left a`) if any
 * of the operations fail.
 *
 * While this class can certainly model input validations, the [Validation][]
 * structure lends itself better to that use case, since it can naturally
 * aggregate failures — monads shortcut on the first failure.
 *
 * [Validation]: https://github.com/folktale/data.validation
 *
 *
 * @class
 * @summary
 * Either[α, β] <: Applicative[β]
 *               , Functor[β]
 *               , Chain[β]
 *               , Show
 *               , Eq
 */
function Either() { }

Left.prototype = clone(Either.prototype)
function Left(a) {
  this.value = a
}

Right.prototype = clone(Either.prototype)
function Right(a) {
  this.value = a
}

// -- Constructors -----------------------------------------------------

/**
 * Constructs a new `Either[α, β]` structure holding a `Left` value. This
 * usually represents a failure due to the right-bias of this structure.
 *
 * @summary a → Either[α, β]
 */
Either.Left = function(a) {
  return new Left(a)
}
Either.prototype.Left = Either.Left

/**
 * Constructs a new `Either[α, β]` structure holding a `Right` value. This
 * usually represents a successful value due to the right bias of this
 * structure.
 *
 * @summary β → Either[α, β]
 */
Either.Right = function(a) {
  return new Right(a)
}
Either.prototype.Right = Either.Right


// -- Conversions ------------------------------------------------------

/**
 * Constructs a new `Either[α, β]` structure from a nullable type.
 *
 * Takes the `Left` case if the value is `null` or `undefined`. Takes the
 * `Right` case otherwise.
 *
 * @summary α → Either[α, α]
 */
Either.fromNullable = function(a) {
  return a != null?       new Right(a)
  :      /* otherwise */  new Left(a)
}
Either.prototype.fromNullable = Either.fromNullable

/**
 * Constructs a new `Either[α, β]` structure from a `Validation[α, β]` type.
 *
 * @summary Validation[α, β] → Either[α, β]
 */
Either.fromValidation = function(a) {
  return a.fold(Either.Left, Either.Right)
}

/**
 * Executes a synchronous computation that may throw and converts it to an
 * Either type.
 *
 * @summary (α₁, α₂, ..., αₙ -> β :: throws γ) -> (α₁, α₂, ..., αₙ -> Either[γ, β])
 */
Either.try = function(f) {
  return function() {
    try {
      return new Right(f.apply(null, arguments))
    } catch(e) {
      return new Left(e)
    }
  }
}


// -- Predicates -------------------------------------------------------

/**
 * True if the `Either[α, β]` contains a `Left` value.
 *
 * @summary Boolean
 */
Either.prototype.isLeft = false
Left.prototype.isLeft   = true

/**
 * True if the `Either[α, β]` contains a `Right` value.
 *
 * @summary Boolean
 */
Either.prototype.isRight = false
Right.prototype.isRight  = true


// -- Applicative ------------------------------------------------------

/**
 * Creates a new `Either[α, β]` instance holding the `Right` value `b`.
 *
 * `b` can be any value, including `null`, `undefined` or another
 * `Either[α, β]` structure.
 *
 * @summary β → Either[α, β]
 */
Either.of = function(a) {
  return new Right(a)
}
Either.prototype.of = Either.of


/**
 * Applies the function inside the `Right` case of the `Either[α, β]` structure
 * to another applicative type.
 *
 * The `Either[α, β]` should contain a function value, otherwise a `TypeError`
 * is thrown.
 *
 * @method
 * @summary (@Either[α, β → γ], f:Applicative[_]) => f[β] → f[γ]
 */
Either.prototype.ap = unimplemented

Left.prototype.ap = function(b) {
  return this
}

Right.prototype.ap = function(b) {
  return b.map(this.value)
}


// -- Functor ----------------------------------------------------------

/**
 * Transforms the `Right` value of the `Either[α, β]` structure using a regular
 * unary function.
 *
 * @method
 * @summary (@Either[α, β]) => (β → γ) → Either[α, γ]
 */
Either.prototype.map = unimplemented
Left.prototype.map   = noop

Right.prototype.map = function(f) {
  return this.of(f(this.value))
}


// -- Chain ------------------------------------------------------------

/**
 * Transforms the `Right` value of the `Either[α, β]` structure using an unary
 * function to monads.
 *
 * @method
 * @summary (@Either[α, β], m:Monad[_]) => (β → m[γ]) → m[γ]
 */
Either.prototype.chain = unimplemented
Left.prototype.chain   = noop

Right.prototype.chain = function(f) {
  return f(this.value)
}

// -- Semigroup ----------------------------------------------------------

/**
 * Concats the `Right` value of the `Either[α, β]` structure with another `Right` or keeps the `Left` on either side
 *
 * @method
 * @summary (@Either[α, m:Monoid]) => Either[β, m] → Either[α, m]
 */
Either.prototype.concat = unimplemented

Left.prototype.concat = function(other) {
  return this
}

Right.prototype.concat = function(other) {
  var that = this
  return other.fold(function(_){
                      return other
                    },
                    function(y) {
                      return that.Right(that.value.concat(y))
                    })
}


// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Either[α, β]` structure.
 *
 * @method
 * @summary (@Either[α, β]) => Void → String
 */
Either.prototype.toString = unimplemented

Left.prototype.toString = function() {
  return 'Either.Left(' + this.value + ')'
}

Right.prototype.toString = function() {
  return 'Either.Right(' + this.value + ')'
}


// -- Eq ---------------------------------------------------------------

/**
 * Tests if an `Either[α, β]` structure is equal to another `Either[α, β]`
 * structure.
 *
 * @method
 * @summary (@Either[α, β]) => Either[α, β] → Boolean
 */
Either.prototype.isEqual = unimplemented

Left.prototype.isEqual = function(a) {
  return a.isLeft && (a.value === this.value)
}

Right.prototype.isEqual = function(a) {
  return a.isRight && (a.value === this.value)
}


// -- Extracting and recovering ----------------------------------------

/**
 * Extracts the `Right` value out of the `Either[α, β]` structure, if it
 * exists. Otherwise throws a `TypeError`.
 *
 * @method
 * @summary (@Either[α, β]) => Void → β         :: partial, throws
 * @see {@link module:lib/either~Either#getOrElse} — A getter that can handle failures.
 * @see {@link module:lib/either~Either#merge} — The convergence of both values.
 * @throws {TypeError} if the structure has no `Right` value.
 */
Either.prototype.get = unimplemented

Left.prototype.get = function() {
  throw new TypeError("Can't extract the value of a Left(a).")
}

Right.prototype.get = function() {
  return this.value
}


/**
 * Extracts the `Right` value out of the `Either[α, β]` structure. If the
 * structure doesn't have a `Right` value, returns the given default.
 *
 * @method
 * @summary (@Either[α, β]) => β → β
 */
Either.prototype.getOrElse = unimplemented

Left.prototype.getOrElse = function(a) {
  return a
}

Right.prototype.getOrElse = function(_) {
  return this.value
}


/**
 * Transforms a `Left` value into a new `Either[α, β]` structure. Does nothing
 * if the structure contain a `Right` value.
 *
 * @method
 * @summary (@Either[α, β]) => (α → Either[γ, β]) → Either[γ, β]
 */
Either.prototype.orElse = unimplemented
Right.prototype.orElse  = noop

Left.prototype.orElse = function(f) {
  return f(this.value)
}


/**
 * Returns the value of whichever side of the disjunction that is present.
 *
 * @summary (@Either[α, α]) => Void → α
 */
Either.prototype.merge = function() {
  return this.value
}


// -- Folds and Extended Transformations -------------------------------

/**
 * Applies a function to each case in this data structure.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ), (β → γ) → γ
 */
Either.prototype.fold = unimplemented

Left.prototype.fold = function(f, _) {
  return f(this.value)
}

Right.prototype.fold = function(_, g) {
  return g(this.value)
}

/**
 * Catamorphism.
 * 
 * @method
 * @summary (@Either[α, β]) => { Left: α → γ, Right: β → γ } → γ
 */
Either.prototype.cata = unimplemented

Left.prototype.cata = function(pattern) {
  return pattern.Left(this.value)
}

Right.prototype.cata = function(pattern) {
  return pattern.Right(this.value)
}


/**
 * Swaps the disjunction values.
 *
 * @method
 * @summary (@Either[α, β]) => Void → Either[β, α]
 */
Either.prototype.swap = unimplemented

Left.prototype.swap = function() {
  return this.Right(this.value)
}

Right.prototype.swap = function() {
  return this.Left(this.value)
}


/**
 * Maps both sides of the disjunction.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ), (β → δ) → Either[γ, δ]
 */
Either.prototype.bimap = unimplemented

Left.prototype.bimap = function(f, _) {
  return this.Left(f(this.value))
}

Right.prototype.bimap = function(_, g) {
  return this.Right(g(this.value))
}


/**
 * Maps the left side of the disjunction.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ) → Either[γ, β]
 */
Either.prototype.leftMap = unimplemented
Right.prototype.leftMap  = noop

Left.prototype.leftMap = function(f) {
  return this.Left(f(this.value))
}

},{}],6:[function(require,module,exports){
// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = require('./either')
},{"./either":5}],7:[function(require,module,exports){
const {
  sequenceOf,
  choice,
  takeLeft,
  many1,
  possibly,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  colon
} = require("./convenience/tokens")

const {
  whitespace,
  whitespaced
} = require("./convenience/whitespace")

const key = require("./key")
const expressions = require("./expressions/expressions")

const Assignment = require("../tree/expressions/Assignment")

// @TODO: Optional key, type statement
const assignment = pipeParsers([
  sequenceOf([
    possibly(
      choice([
        // aliased assignment eg. `key: alias:: expressions`
        takeLeft(many1(takeLeft(whitespaced(key))(colon)))(
          sequenceOf([
            colon,
            possibly(whitespace)
          ])
        ),
        // single key assignment eg. `key: expressions`
        takeLeft(key)(whitespaced(colon))
      ]),
    ),
    whitespaced(expressions)
  ]),
  mapTo(([keys, expressions]) => keys != null ? new Assignment(keys, expressions) : expressions)
])

module.exports = assignment

},{"../tree/expressions/Assignment":31,"./convenience/tokens":10,"./convenience/whitespace":11,"./expressions/expressions":15,"./key":21,"arcsecond":4}],8:[function(require,module,exports){
const {
  anythingExcept,
  many
} = require("arcsecond")

const {
  newline,
  eol
} = require("./whitespace")

const anyChar = anythingExcept(newline)
const anyChars = many(anyChar)
const anyCharExceptEOL = anythingExcept(eol)
const anyCharsExceptEOL = many(anyCharExceptEOL)

module.exports = {
  anyChar,
  anyChars,
  anyCharExceptEOL,
  anyCharsExceptEOL
}

},{"./whitespace":11,"arcsecond":4}],9:[function(require,module,exports){
const {
  composeParsers
} = require("arcsecond")

const times = (parser, n) =>
  composeParsers(Array(n).fill(parser))

module.exports = times

},{"arcsecond":4}],10:[function(require,module,exports){
const {
  char,
  str
} = require("arcsecond")

// tokens (ASCII)
const space = char(" ")
const tab = char("\t")
const dot = char(".")
const plus = char("+")
const comma = char(",")
const minus = char("-")
const asterisk = char("*")
const slash = char("/")
const colon = char(":")
const semicolon = char(";")
const underscore = char("_")
const quote = char("'")
const doubleQuote = char("\"")
// @TODO: Rename to number
const numberSign = char("#")
const backslash = char("\\")
const leftParens = char("(")
const rightParens = char(")")
const pipe = char("|")

// multchar tokens
const escapedBackslash = str("\\")
const arrow = str("->")
const rangeDelimiter = str(",,")

module.exports = {
  space,
  tab,
  dot,
  plus,
  comma,
  minus,
  asterisk,
  slash,
  colon,
  semicolon,
  underscore,
  quote,
  doubleQuote,
  numberSign,
  backslash,
  leftParens,
  rightParens,
  pipe,

  escapedBackslash,
  arrow,
  rangeDelimiter
}

},{"arcsecond":4}],11:[function(require,module,exports){
const {
  char,
  sequenceOf,
  possibly,
  many,
  many1,
  choice,
  between,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  space,
  minus,
  tab,
  semicolon
} = require("./tokens")

const charsToString = require("../../utils/charsToString")

const times = require("./times")

const lf = char("\n")
const cr = char("\r")
const newline = sequenceOf([possibly(cr), lf])

const spaces = pipeParsers([
  many1(space),
  mapTo(spaces => charsToString(spaces))
])

const whitespace = many(choice([space, tab]))
const whitespaced = parser => between(whitespace)(whitespace)(parser)
const whitespaceAndNewline = many(choice([space, tab, newline]))
const whitespaceAndNewlined = parser => between(whitespaceAndNewline)(whitespaceAndNewline)(parser)
const eol = choice([
  whitespaceAndNewlined(semicolon),
  sequenceOf([whitespace, newline])
])
const indent = sequenceOf([space, space])
const dashedIndent = sequenceOf([minus, space])
const lastIndent = choice([indent, dashedIndent])
const indents = (num = 1) => {
  if (num <= 1) return lastIndent
  const indents = times(indent, num - 1)
  return sequenceOf([
    indents,
    lastIndent
  ])
}

module.exports = {
  newline,
  spaces,
  whitespace,
  whitespaced,
  whitespaceAndNewline,
  whitespaceAndNewlined,
  eol,
  indent,
  dashedIndent,
  indents
}

},{"../../utils/charsToString":67,"./times":9,"./tokens":10,"arcsecond":4}],12:[function(require,module,exports){
const {
  char,
  choice,
  between
} = require("arcsecond")

const {
  whitespaced
} = require("./whitespace")

const wrap = (parser, bracketType = "PARENS", whitespace = true) => {
  const brackets = {
    "PARENS": ["(", ")"],
    "SQUARE": ["[", "]"],
    "CURLY" : ["{", "}"],
    "ANGLE" : ["<", ">"]
  }
  if (brackets[bracketType] == null) throw new Error ("Invalid bracketType")
  const [l, r] = brackets[bracketType]
  const constructParser = s => {
    const p = char(s)
    return whitespace ? whitespaced(p) : p
  }
  const left = constructParser(l)
  const right = constructParser(r)
  return between(left)(right)(parser)
}

const optionalWrap = (parser, bracketType = "PARENS", whitespace = true) => {
  const wrapped = wrap(parser, bracketType, whitespace)
  return choice([
    wrapped,
    parser
  ])
}

const wrappedInParentheses = parser => wrap(parser)
// @TODO: Rename to optionalyWrapped...
const optionalWrappedInParentheses = parser => optionalWrap(parser)
const optionalWrappedInCurlyBraces = parser => optionalWrap(parser, "CURLY")

module.exports = {
  wrappedInParentheses,
  optionalWrappedInParentheses,
  optionalWrappedInCurlyBraces
}

},{"./whitespace":11,"arcsecond":4}],13:[function(require,module,exports){
// @LINK: https://github.com/jneen/parsimmon/blob/master/examples/math.js

const {
  Parser,
  str,
  sequenceOf,
  many,
  choice,
  pipeParsers,
  recursiveParser,
  between,
  takeLeft,
  mapTo
} = require("arcsecond")

const {
  whitespace,
  whitespaced
} = require("./convenience/whitespace")

const {
  leftParens,
  rightParens
} = require("./convenience/tokens")

const toArray = require("../utils/toArray")

const createOperatorsParser = (operators, allowWhitespace = true) => {
  const operatorParser = operator => operator instanceof Parser ? operator : str(operator)
  // @TODO: Extract `choice(operators.map(op => operatorParser(op)))`
  switch (allowWhitespace) {
  case "REQUIRED":
    return choice(operators.map(op => takeLeft(operatorParser(op))(whitespace)))
  case true:
    return whitespaced(choice(operators.map(op => operatorParser(op))))
  case false:
    return choice(operators.map(op => operatorParser(op)))
  default:
    throw new Error ("Invalid whitespace argument")
  }
}

const prefix = (expression, operatorsParser, mapToFunc) => {
  return pipeParsers([
    sequenceOf([
      many(operatorsParser),
      expression
    ]),
    mapTo(([operators, expression]) => {
      if (operators.length === 0) return expression
      const arr = operators.reverse().reduce((acc, operator) => [operator, acc], expression)
      return mapToFunc(arr)
    })
  ])
}

const postfix = (expression, operatorsParser, mapToFunc) => {
  return pipeParsers([
    sequenceOf([
      expression,
      many(operatorsParser)
    ]),
    mapTo(([expression, operators]) => {
      if (operators.length === 0) return expression
      const arr = operators.reduce((acc, operator) => [operator, acc], expression)
      return mapToFunc(arr)
    })
  ])
}

const rightAssociative = (expression, operatorsParser, mapToFunc) => pipeParsers([
  sequenceOf([
    expression,
    many(
      sequenceOf([
        operatorsParser,
        expression
      ])
    )
  ]),
  mapTo(([expression, expressions]) => {
    if (expressions.length === 0) return expression
    const flat = [expression, expressions].flat(Infinity)
    // @TODO: Can we use Array.reduce here?
    while (flat.length >= 3) {
      const operand1 = flat.pop()
      const operator = flat.pop()
      const operand = flat.pop()
      flat.push([operator, operand, operand1])
    }
    return mapToFunc(flat.flat())
  })
])

const leftAssociative = (expression, operatorsParser, mapToFunc) => pipeParsers([
  sequenceOf([
    expression,
    many(
      sequenceOf([
        operatorsParser,
        expression
      ])
    )
  ]),
  mapTo(([expression, expressions]) => {
    if (expressions.length === 0) return expression
    const flat = [expression, expressions].flat(Infinity)
    const operations = flat.reduce((acc, cur) => {
      if (acc.length === 3) {
        return [cur, acc]
      } else if (acc.length === 2) {
        return acc.concat(cur)
      } else if (acc.length === 1) {
        return [cur].concat(acc)
      } else if (acc.length === 0) {
        return [cur]
      }
    }, [])
    return mapToFunc(operations)
  })
])

const mapTypeToFunctionName = {
  "PREFIX": prefix,
  "POSTFIX": postfix,
  "RIGHT_ASSOCIATIVE": rightAssociative,
  "LEFT_ASSOCIATIVE": leftAssociative
}

// type table: [ {
//   type: "PRE" / "POST" / "RIGHT" / "LEFT",
//   operators: STRING | [STRING],
//   mapTo: Function
// } ]
// type base: Parser

const createPrecedenceParser = (table, baseExpression) => {

  const expression = recursiveParser(() =>
    choice([
      baseExpression,
      between(leftParens)(rightParens)(whitespaced(parser))
    ])
  )

  const parser = table.reduce((parser, level) => {
    const func = mapTypeToFunctionName[level.type]
    const operators = toArray(level.operators)
    const operatorsParser = createOperatorsParser(operators, level.whitespace)
    return func(parser, operatorsParser, level.mapTo)
  }, expression)

  return parser
}

module.exports = createPrecedenceParser

},{"../utils/toArray":70,"./convenience/tokens":10,"./convenience/whitespace":11,"arcsecond":4}],14:[function(require,module,exports){
const {
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const {
  leftParens,
  rightParens
} = require("../convenience/tokens")

const {
  whitespace
} = require("../convenience/whitespace")

const Expression = require("../../tree/expressions/Expression")

const empty = pipeParsers([
  sequenceOf([
    leftParens,
    possibly(whitespace),
    rightParens
  ]),
  mapTo(() => new Expression())
])

module.exports = empty

},{"../../tree/expressions/Expression":32,"../convenience/tokens":10,"../convenience/whitespace":11,"arcsecond":4}],15:[function(require,module,exports){
const {
  choice
} = require("arcsecond")

const {
  spaces
} = require("../convenience/whitespace")

const nullParser = require("./scalars/null")
const boolean = require("./scalars/boolean")
const number = require("./scalars/number")
const string = require("./scalars/string")
const identity = require("./identity")
const empty = require("./empty")

const keyPrefix = require("../keyPrefix")
const keyPostfix = require("../keyPostfix")

const createPrecedenceParser = require("../createPrecedenceParser")

const Assignment = require("../../tree/expressions/Assignment")
const Operation = require("../../tree/expressions/operations/Operation")
const Application = require("../../tree/expressions/scopes/Application")
const Property = require("../../tree/expressions/Property")
const FunctionType = require("../../tree/types/FunctionType")
const Expression = require("../../tree/expressions/Expression")

const { typeLiteral: type } = require("../types/type")

const notOperator = operator => expression => expression !== operator

// scalar
const basic = choice([
  nullParser,
  boolean,
  number,
  string,
  identity,
  type,
  empty
])

// @TODO: Merge mapPostfixToApplication, mapToApplication
const mapPostfixToApplication = matches => {
  const evaluate = (operator, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Application(expression)
  }
  return evaluate(...matches)
}

const mapToApplication = matches => {
  const evaluate = (operator, arrayOrFunc, expression) => {
    const func = Array.isArray(arrayOrFunc) ? evaluate(...arrayOrFunc) : arrayOrFunc
    return new Application(func, expression)
  }
  return evaluate(...matches)
}

const mapPostfixToProperty = matches => {
  const evaluate = (key, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Property(key, expression)
  }
  return evaluate(...matches)
}

const mapPrefixToOperation = matches => {
  const evaluate = (operator, arrayOrExpression) => {
    const operand = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Operation("PREFIX", operator, operand)
  }
  return evaluate(...matches)
}

const mapToOperation = matches => {
  const evaluate = (operator, arrayOrExpression, arrayOrExpression1) => {
    const operand = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    const operand1 = Array.isArray(arrayOrExpression1) ? evaluate(...arrayOrExpression1) : arrayOrExpression1
    return new Operation("INFIX", operator, operand, operand1)
  }
  return evaluate(...matches)
}

const mapToAssignment = matches => {
  const evaluate = (key, arrayOrExpression) => {
    const expression = Array.isArray(arrayOrExpression) ? evaluate(...arrayOrExpression) : arrayOrExpression
    return new Assignment(key, expression)
  }
  return evaluate(...matches)
}

const mapToPlural = expressions =>
  new Expression(null, expressions.flat(Infinity).filter(notOperator(",")))

const mapToFunctionType = matches =>
  new FunctionType(matches[1], matches[2])

const mapToExpressions = matches =>
  matches
    .flat(Infinity)
    .filter(notOperator(";"))

const table = [

  // Application
  { type: "POSTFIX", operators: "()", mapTo: mapPostfixToApplication },

  // Properties
  { type: "POSTFIX", operators: keyPostfix, mapTo: mapPostfixToProperty, whitespace: false },

  // Booleans
  { type: "PREFIX", operators: "!", mapTo: mapPrefixToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: "&", mapTo: mapToOperation },
  // Boolean OR, Sum Type
  { type: "LEFT_ASSOCIATIVE", operators: "|", mapTo: mapToOperation },

  // Numbers
  { type: "PREFIX", operators: "-", mapTo: mapPrefixToOperation },
  { type: "RIGHT_ASSOCIATIVE", operators: "**", mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: ["*", "/"], mapTo: mapToOperation },
  { type: "LEFT_ASSOCIATIVE", operators: ["+", "-"], mapTo: mapToOperation },

  // Range
  { type: "LEFT_ASSOCIATIVE", operators: ",,", mapTo: mapToOperation },

  // Assignment
  { type: "PREFIX", operators: keyPrefix, mapTo: mapToAssignment },

  // Plurals
  { type: "LEFT_ASSOCIATIVE", operators: ",", mapTo: mapToPlural },

  // Function Type
  { type: "LEFT_ASSOCIATIVE", operators: "->", mapTo: mapToFunctionType },

  // Application by space
  { type: "LEFT_ASSOCIATIVE", operators: spaces, mapTo: mapToApplication, whitespace: false },

  // Scope
  { type: "LEFT_ASSOCIATIVE", operators: ";", mapTo: mapToExpressions }
]

const parser = createPrecedenceParser(table, basic)

module.exports = parser

},{"../../tree/expressions/Assignment":31,"../../tree/expressions/Expression":32,"../../tree/expressions/Property":34,"../../tree/expressions/operations/Operation":37,"../../tree/expressions/scopes/Application":45,"../../tree/types/FunctionType":62,"../convenience/whitespace":11,"../createPrecedenceParser":13,"../keyPostfix":22,"../keyPrefix":23,"../types/type":27,"./empty":14,"./identity":16,"./scalars/boolean":17,"./scalars/null":18,"./scalars/number":19,"./scalars/string":20,"arcsecond":4}],16:[function(require,module,exports){
const {
  pipeParsers,
  choice,
  sequenceOf,
  mapTo
} = require("arcsecond")

const {
  dot
} = require("../convenience/tokens")

const key = require("../key")
const Identity = require("../../tree/expressions/Identity")

const identity = pipeParsers([
  choice([
    pipeParsers([
      key,
      mapTo(key => key.name)
    ]),
    pipeParsers([
      sequenceOf([dot, key]),
      mapTo(([dot, key]) => dot + key.name)
    ]),
    dot
  ]),
  mapTo(str => new Identity(str))
])

module.exports = identity

},{"../../tree/expressions/Identity":33,"../convenience/tokens":10,"../key":21,"arcsecond":4}],17:[function(require,module,exports){
const {
  pipeParsers,
  str,
  mapTo,
  choice
} = require("arcsecond")

const Boolean = require("../../../tree/expressions/scalars/Boolean")

const boolean = pipeParsers([
  choice([
    str("false"),
    str("true")
  ]),
  mapTo(str => new Boolean(null, str))
])

module.exports = boolean

},{"../../../tree/expressions/scalars/Boolean":40,"arcsecond":4}],18:[function(require,module,exports){
const {
  pipeParsers,
  str,
  mapTo
} = require("arcsecond")

const Null = require("../../../tree/expressions/scalars/Null")

const nullParser = pipeParsers([
  str("null"),
  mapTo(str => new Null(null, str))
])

module.exports = nullParser

},{"../../../tree/expressions/scalars/Null":41,"arcsecond":4}],19:[function(require,module,exports){
const {
  digit,
  sequenceOf,
  many,
  possibly,
  choice,
  anyOfString,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  minus,
  plus,
  dot,
  underscore
} = require("../../convenience/tokens")

const charsToString = require("../../../utils/charsToString")
const Number = require("../../../tree/expressions/scalars/Number")

const int = pipeParsers([
  sequenceOf([
    digit,
    many(
      choice([
        underscore,
        digit
      ])
    )
  ]),
  mapTo(([f, cs]) => charsToString(f, cs))
])

const float = pipeParsers([
  sequenceOf([int, dot, int]),
  mapTo(([n, dot, n1]) => charsToString(n, dot, n1))
])

const numberPrefix = choice([minus, plus])

const prefixedInt = pipeParsers([
  sequenceOf([
    possibly(numberPrefix),
    int
  ]),
  mapTo(([prefix, value]) => charsToString(prefix, value))
])

const scientific = pipeParsers([
  sequenceOf([
    choice([
      float,
      int
    ]),
    anyOfString("eE"),
    prefixedInt
  ]),
  mapTo(([n,,n1]) => charsToString(n, "e", n1))
])

const number = pipeParsers([
  choice([
    scientific,
    float,
    int
  ]),
  mapTo(number => new Number(null, number))
])

module.exports = number

},{"../../../tree/expressions/scalars/Number":42,"../../../utils/charsToString":67,"../../convenience/tokens":10,"arcsecond":4}],20:[function(require,module,exports){
const {
  pipeParsers,
  sequenceOf,
  str,
  mapTo,
  many,
  choice,
  anythingExcept
} = require("arcsecond")

const {
  doubleQuote
} = require("../../convenience/tokens")

const {
  newline
} = require("../../convenience/whitespace")

const charsToString = require("../../../utils/charsToString")
const String = require("../../../tree/expressions/scalars/String")

const escapedQuote = str(`\\"`) // eslint-disable-line quotes

const string = pipeParsers([
  sequenceOf([
    doubleQuote,
    pipeParsers([
      many(choice([
        escapedQuote,
        anythingExcept(
          choice([
            doubleQuote,
            newline
          ])
        )
      ])),
      mapTo(charsToString)
    ]),
    choice([
      doubleQuote,
      newline
    ])
  ]),
  mapTo(([,s, closingChar]) => {
    const shouldTrimEnd = closingChar !== "\""
    const str = shouldTrimEnd ? s.trimEnd() : s
    return new String(str)
  })
])

module.exports = string

},{"../../../tree/expressions/scalars/String":44,"../../../utils/charsToString":67,"../../convenience/tokens":10,"../../convenience/whitespace":11,"arcsecond":4}],21:[function(require,module,exports){
const {
  choice,
  letters,
  regex,
  sequenceOf,
  possibly,
  pipeParsers,
  mapTo
} = require("arcsecond")

const {
  underscore,
  quote
} = require("./convenience/tokens")

const charsToString = require("../utils/charsToString")

const Key = require("../tree/Key")

const prefix = choice([underscore, quote])
const lowercase = regex(/^[a-z]/)
const key = pipeParsers([
  sequenceOf([
    possibly(prefix),
    lowercase,
    possibly(letters)
  ]),
  mapTo(([prefix, first, chars]) => new Key(charsToString(first, chars), prefix))
])

module.exports = key

},{"../tree/Key":30,"../utils/charsToString":67,"./convenience/tokens":10,"arcsecond":4}],22:[function(require,module,exports){
const {
  takeRight
} = require("arcsecond")

const {
  dot
} = require("./convenience/tokens")

const key = require("./key")

// @TODO: Whitespace
// @TODO: New line
const keyPostfix = takeRight(dot)(key)

module.exports = keyPostfix

},{"./convenience/tokens":10,"./key":21,"arcsecond":4}],23:[function(require,module,exports){
const {
  takeLeft
} = require("arcsecond")

const {
  whitespaced
} = require("./convenience/whitespace")

const {
  colon
} = require("./convenience/tokens")

const key = require("./key")

const keyPrefix = takeLeft(key)(whitespaced(colon))

module.exports = keyPrefix

},{"./convenience/tokens":10,"./convenience/whitespace":11,"./key":21,"arcsecond":4}],24:[function(require,module,exports){
const reduceStringsToObject = require("../utils/reduceStringsToObject")

const {
  str
} = require("arcsecond")

const keywords = [
  "type",
  "key"
]

const parsers = reduceStringsToObject(keywords, keyword => str(keyword))
module.exports = parsers

},{"../utils/reduceStringsToObject":69,"arcsecond":4}],25:[function(require,module,exports){
const ScopeLine = require("../tree/text/ScopeLine")
const ScopeOpener = require("../tree/text/ScopeOpener")
const TypeOpener = require("../tree/text/TypeOpener")
const TypeScope = require("../tree/text/TypeScope")
const TypeConstructor = require("../tree/types/TypeConstructor")
const Type = require("../tree/types/Type")
const Gibberish = require("../tree/text/Gibberish")
const Function = require("../tree/expressions/scopes/Function")
const FunctionScope = require("../tree/expressions/scopes/FunctionScope")
const Assignment = require("../tree/expressions/Assignment")

// @TODO: throw new Error ("Can only define type at root")
// @TODO: throw new Error ("Can only add TypeConstructor as property to type")
const mapLinesToScopeLines = lines => {

  const scopes = new ScopeLine()
  const currentIndices = []
  const lastScope = () => currentIndices.reduce((scopeLine, index) => scopeLine.getScopeLine(index), scopes)

  const pushToScope = line => {
    const scopeLine = new ScopeLine(line)
    const scope = lastScope()
    scope.addScopeLine(scopeLine)
  }

  const lastIndex = () => {
    const l = lastScope().numScopeLines
    return l > 0 ? l - 1 : 0
  }

  lines.forEach(line => {

    if (line.isEmpty) return

    const currentIndent = currentIndices.length
    const indents = line.indents

    // deeper
    if (indents > currentIndent) {
      // new scope
      currentIndices.push(lastIndex())
    }

    // higher
    if (indents < currentIndent) {
      const diff = currentIndent - indents
      for (let i = 0; i < diff; i++) {
        currentIndices.pop()
      }
    }

    // push to parent scope
    pushToScope(line)
  })

  return scopes.scopeLines
}

const filterComments = scopeLines => {
  const filterLine = scopeLine => {
    const line = scopeLine.line
    const scopeLines = scopeLine.scopeLines
    // clear child line
    if (line.isComment) return null
    scopeLine.scopeLines = scopeLines.map(filterLine).filter(scopeLine => scopeLine != null)
    return scopeLine
  }
  return scopeLines.map(filterLine).filter(scopeLine => scopeLine != null)
}

const checkGibberish = scopeLines => {
  const check = scopeLine => {
    const line = scopeLine.line
    const scopeLines = scopeLine.scopeLines
    if (line.parsedContent instanceof Gibberish) {
      throw new Error ("Invalid characters at line: " + line.lineNumber)
    }
    scopeLines.forEach(check)
  }
  scopeLines.forEach(check)
  return scopeLines
}

const checkIndention = scopeLines => {
  const checkIndents = scopeLine => {
    const line = scopeLine.line
    const indents = line.indents
    const scopeLines = scopeLine.scopeLines
    scopeLines.forEach(scopeLine => {
      if (scopeLine.line.indents > indents + 1)
        throw new Error ("Invalid indention at line: " + scopeLine.line.lineNumber)
      checkIndents(scopeLine)
    })
  }
  scopeLines.forEach(checkIndents)
  return scopeLines
}

const checkScopeOpeners = scopeLines => {
  const checkScopeOpener = scopeLine => {
    const line = scopeLine.line
    const scopeLines = scopeLine.scopeLines
    if (scopeLines.length > 0 && line.canOpenScope === false)
      throw new Error ("Can not open scope at line:" + line.lineNumber)
    if (scopeLines.length === 0 && line.parsedContent instanceof ScopeOpener) {
      throw new Error ("Scope opened without adding expressions")
    }
    scopeLines.forEach(checkScopeOpener)
  }
  scopeLines.forEach(checkScopeOpener)
  return scopeLines
}

const mapScopeLinesToScopes = (Scope, scopeLines) => {

  const rootScope = new Scope()

  const addToScope = (scope, content) => {
    if (content instanceof TypeConstructor) {
      scope.addType(content.name, content.type)
    }
    else if (content instanceof TypeScope) {
      const type = new Type(content.name, null, content.types, null, null, content.properties)
      scope.addType(content.name, type)
    }
    else if (scope instanceof TypeScope) {
      if (content.expressions[0] instanceof Type) {
        // @TODO: Set keys from Assignment => Type
        scope.addType(content.expressions[0])
      } else {
        scope.addProperty(content)
      }
    }
    else {
      scope.addExpressions(content)
    }
  }

  const scopeLineToExpressionsOrScope = scopeLine => {

    const line = scopeLine.line
    const content = line.parsedContent
    const scopeLines = scopeLine.scopeLines

    // expression(s)
    if (scopeLine.isEmpty) return content

    // type
    if (content instanceof TypeOpener) {
      const scope = new TypeScope(content.name)
      const properties = scopeLines.map(scopeLine => scopeLine.line.parsedContent)
      properties.forEach(property => addToScope(scope, property))
      return scope
    }

    if (Scope == FunctionScope) {
      const scope = new Scope()
      const expressions = scopeLines.map(scopeLineToExpressionsOrScope)
      expressions.forEach(expression => addToScope(scope, expression))
      return new Assignment(content.key, new Function(content.functionType, scope))
    }

    // new scope
    const scope = new Scope(content.key)
    const expressions = scopeLines.map(scopeLineToExpressionsOrScope)
    expressions.forEach(expression => addToScope(scope, expression))
    return scope
  }

  scopeLines.forEach(scopeLine => {
    addToScope(rootScope, scopeLineToExpressionsOrScope(scopeLine))
  })

  return rootScope
}

const linesToScopes = (Scope, lines) => {
  // @TODO: Improve chaining / composition
  return mapScopeLinesToScopes(
    Scope,
    checkScopeOpeners(
      checkIndention(
        checkGibberish(
          filterComments(
            mapLinesToScopeLines(lines))))))
}

module.exports = linesToScopes

},{"../tree/expressions/Assignment":31,"../tree/expressions/scopes/Function":48,"../tree/expressions/scopes/FunctionScope":49,"../tree/text/Gibberish":55,"../tree/text/ScopeLine":58,"../tree/text/ScopeOpener":59,"../tree/text/TypeOpener":60,"../tree/text/TypeScope":61,"../tree/types/Type":63,"../tree/types/TypeConstructor":64}],26:[function(require,module,exports){
const {
  char,
  choice,
  many,
  lookAhead,
  sequenceOf,
  endOfInput,
  possibly,
  pipeParsers,
  takeLeft,
  mapTo,
  parse,
  toValue
} = require("arcsecond")

const {
  colon
} = require("./convenience/tokens")

const {
  indent,
  whitespace,
  whitespaced
} = require("./convenience/whitespace")

const {
  anyChars,
  anyCharsExceptEOL
} = require("./convenience/convenience")

const charsToString = require("../utils/charsToString")

const key = require("./key")
const typeLiteral = require("./types/typeLiteral")
const assignment = require("./assignment")
const typeConstructor = require("./types/typeConstructor")
const { type, functionType } = require("./types/type")
const eol = char("\n")

const linesToScopes = require("./linesToScopes")

const Indent = require("../tree/text/Indent")
const ScopeOpener = require("../tree/text/ScopeOpener")
const TypeOpener = require("../tree/text/TypeOpener")
const DataScope = require("../tree/expressions/scopes/DataScope")
const FunctionScope = require("../tree/expressions/scopes/FunctionScope")
const Line = require("../tree/text/Line")
const Gibberish = require("../tree/text/Gibberish")

const indents = pipeParsers([
  many(indent),
  mapTo(indents => new Indent(indents))
])

// @TODO: Optional colon
const scopeOpener = pipeParsers([
  sequenceOf([
    key,
    whitespaced(colon),
    possibly(whitespaced(functionType)),
    endOfInput
  ]),
  mapTo(([key, , functionType]) => new ScopeOpener(key, functionType))
])

// @TODO: Optional colon
const typeOpener = pipeParsers([
  sequenceOf([
    typeLiteral,
    whitespaced(colon),
    endOfInput
  ]),
  mapTo(([name]) => new TypeOpener(name))
])

const gibberish = pipeParsers([
  anyChars,
  mapTo(chars => new Gibberish(charsToString(chars)))
])

const tillEndOfLine = parser =>
  pipeParsers([
    sequenceOf([
      parser,
      whitespace,
      endOfInput
    ]),
    mapTo(([parser]) => parser)
  ])

// @TODO: Wrap in whitspace
const lineContent = choice([
  typeOpener,
  scopeOpener,
  assignment,
  tillEndOfLine(typeConstructor),
  // @TODO: Remove when assignment or expressions can handle `key: String`
  tillEndOfLine(type),
  gibberish
])

const line = pipeParsers([
  sequenceOf([
    indents,
    pipeParsers([anyCharsExceptEOL, mapTo(charsToString)]),
    choice([eol, lookAhead(endOfInput)])
  ]),
  mapTo(([indent, chars]) => [chars, indent])
])

const linesParser = Scope => pipeParsers([
  takeLeft(many(line))(endOfInput),
  mapTo(linesChars => {
    const lines = linesChars.map((line, index) => new Line(line[1].chars + line[0], index + 1, line[1].level))
    // @TODO: Move into Line
    const parsedLines = lines.map(line => {
      let parsedContent = ""
      // @TODO: parse lines after comments have been filtered out
      if (line.content !== "") {
        try {
          parsedContent = toValue(parse(lineContent)(line.content))
        } catch (err) {
          throw err
        }
      }
      line.setParsedContent(parsedContent)
      return line
    })

    return linesToScopes(Scope, parsedLines)
  })
])

module.exports = (data = false) => {
  const Scope = data ? DataScope : FunctionScope
  return linesParser(Scope)
}

},{"../tree/expressions/scopes/DataScope":46,"../tree/expressions/scopes/FunctionScope":49,"../tree/text/Gibberish":55,"../tree/text/Indent":56,"../tree/text/Line":57,"../tree/text/ScopeOpener":59,"../tree/text/TypeOpener":60,"../utils/charsToString":67,"./assignment":7,"./convenience/convenience":8,"./convenience/tokens":10,"./convenience/whitespace":11,"./key":21,"./linesToScopes":25,"./types/type":27,"./types/typeConstructor":28,"./types/typeLiteral":29,"arcsecond":4}],27:[function(require,module,exports){
const {
  choice,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo,
  sepBy1
} = require("arcsecond")

const {
  whitespaced
} = require("../convenience/whitespace")

const {
  wrappedInParentheses,
  optionalWrappedInParentheses
} = require("../convenience/wrapped")

const {
  colon,
  comma,
  pipe,
  arrow
} = require("../convenience/tokens")

const key = require("../key")
const typeLiteral = require("./typeLiteral")

const Type = require("../../tree/types/Type")


const wrappedTypeLiteral = pipeParsers([
  optionalWrappedInParentheses(typeLiteral),
  mapTo(type => new Type (type))
])

const sumType = pipeParsers([
  optionalWrappedInParentheses(
    sepBy1(whitespaced(pipe))(wrappedTypeLiteral)
  ),
  mapTo(types => {
    if (types.length === 1) return types[0]
    return new Type (null, types)
  })
])

// @TODO: Aliases
const namedType = type => pipeParsers([
  sequenceOf([
    possibly(
      pipeParsers([
        sequenceOf([
          key,
          whitespaced(colon)
        ]),
        mapTo(([key]) => key)
      ])
    ),
    type
  ]),
  mapTo(([key, type]) => {
    if (key == null) return type
    const name = type.name
    const options = type.options
    const types = type.types
    const inputTypes = type.inputTypes
    return new Type (name, options, types, inputTypes, key)
  })
])

const productType = pipeParsers([
  optionalWrappedInParentheses(
    sepBy1(whitespaced(comma))(optionalWrappedInParentheses(namedType(sumType)))
  ),
  mapTo(types => {
    if (types.length === 1) return types[0]
    return new Type (null, null, types)
  })
])

const types = choice([
  namedType(
    wrappedInParentheses(productType)
  ),
  productType
])

const functionType = pipeParsers([
  sequenceOf([
    types,
    whitespaced(arrow),
    types
  ]),
  mapTo(([inputType,,type]) => {
    const types = type.isCompound ? type.types : type
    const inputTypes = inputType.isCompound ? inputType.types : inputType
    return new Type (null, null, types, inputTypes)
  })
])

const type = choice([
  functionType,
  types
])

module.exports = {
  functionType,
  types,
  type,
  typeLiteral: wrappedTypeLiteral
}

},{"../../tree/types/Type":63,"../convenience/tokens":10,"../convenience/whitespace":11,"../convenience/wrapped":12,"../key":21,"./typeLiteral":29,"arcsecond":4}],28:[function(require,module,exports){
const {
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const {
  colon
} = require("../convenience/tokens")

const {
  whitespace,
  whitespaced
} = require("../convenience/whitespace")

const {
  optionalWrappedInParentheses
} = require("../convenience/wrapped")

const { type: typeKeyword } = require("../keywords")
const typeLiteral = require("./typeLiteral")
const { type } = require("./type")

const TypeConstructor = require("../../tree/types/TypeConstructor")

const typeConstructor = optionalWrappedInParentheses(
  pipeParsers([
    sequenceOf([
      possibly(
        sequenceOf([
          typeKeyword,
          whitespace
        ])
      ),
      typeLiteral,
      possibly(
        pipeParsers([
          sequenceOf([
            whitespaced(colon),
            type
          ]),
          mapTo(([,type]) => type)
        ])
      )
    ]),
    mapTo(([,name, type]) => new TypeConstructor(name, type))
  ])
)

module.exports = typeConstructor

},{"../../tree/types/TypeConstructor":64,"../convenience/tokens":10,"../convenience/whitespace":11,"../convenience/wrapped":12,"../keywords":24,"./type":27,"./typeLiteral":29,"arcsecond":4}],29:[function(require,module,exports){
const {
  letters,
  regex,
  pipeParsers,
  sequenceOf,
  possibly,
  mapTo
} = require("arcsecond")

const charsToString = require("../../utils/charsToString")

const uppercase = regex(/^[A-Z]/)
const typeLiteral = pipeParsers([
  sequenceOf([
    uppercase,
    possibly(letters)
  ]),
  mapTo(chars => charsToString(chars))
])

module.exports = typeLiteral

},{"../../utils/charsToString":67,"arcsecond":4}],30:[function(require,module,exports){
const visibilityMap = {
  "_": "PRIVATE",
  "'": "CONVENIENCE"
}

class Key {

  constructor (name, prefix) {
    this.name = name
    this.visibility = visibilityMap[prefix] || "DATA"
  }
}

module.exports = Key

},{}],31:[function(require,module,exports){
const Expression = require("./Expression")
const toArray = require("../../utils/toArray")

class Assignment extends Expression {

  constructor (keys, expressions) {
    super(null, expressions)
    this.keys = toArray(keys)
  }
}

module.exports = Assignment

},{"../../utils/toArray":70,"./Expression":32}],32:[function(require,module,exports){
const toArray = require("../../utils/toArray")
const { isFunction } = require("../../utils/is")
const setVisibilityProperties = require("../types/setVisibilityProperties")

const propertiesAny = setVisibilityProperties({
  is: true,
  keys: ({ properties }) => {
    return Object.keys(properties)
      .map(key => properties[key])
      .filter(property => property.visibility === "DATA")
      .map(property => property.key)
  },
  isPlural: ({ isPlural }) => isPlural,
  size: ({ isEmpty, isSingle, value }) => {
    if (isEmpty) return 0
    if (isSingle) return 1
    return value.length
  }
})

class Expression {

  constructor (type, expressions, properties = {}) {
    this.type = type // string | Type
    this.isEvaluated = false

    // properties
    this.setProperties(properties)
    this.isCompound = this.getProperty("keys").length > 0

    // expressions
    const init = this.hasProperty("init", "PRIVATE") ? this.getProperty("init", "PRIVATE") : null
    const parsedExpressions = init != null ? init(expressions) : expressions
    this.expressions = []
    this.addExpressions(parsedExpressions)
  }

  setProperties (properties) {
    this.properties = {
      ...propertiesAny,
      ...properties
    }
  }

  hasProperty (name, visibility) {
    const property = this.properties[name]
    if (property === undefined) return false
    return visibility != null ? property.visibility === visibility : true
  }

  getProperty (name, visibility) {
    if (this.hasProperty(name, visibility) === false)
      throw new Error (name + " is not a property of " + this.type)
    const entry = this.properties[name]
    if (visibility != null && entry.visibility !== visibility)
      throw new Error (name + " does not have the correct visibility on " + this.type)
    const property = entry.property
    if (isFunction(property)) return property(this)
    return property
  }

  addExpressions (expressions) {
    toArray(expressions).forEach(expression => this.expressions.push(expression))
    this.setSize()
  }

  setSize () {
    const length = this.expressions.length
    this.isEmpty = length === 0
    this.isSingle = length === 1
    this.isPlural = length > 1
  }

  // overridden in Identity
  fetch () {
    return this
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const values = this.expressions.map(expression => expression.evaluate(env))
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Expression

},{"../../utils/is":68,"../../utils/toArray":70,"../types/setVisibilityProperties":65}],33:[function(require,module,exports){
const Expression = require("./Expression")

class Identity extends Expression {

  constructor (str) {
    super()
    const self = str[0] === "."
    const key = str.replace(/^\./, "")
    this.key = key !== "" ? key : null
    this.self = self
    this.isEvaluated = false
  }

  fetch (env) {
    if (env.has(this.key) === false)
      throw new Error (this.key + " is not defined in environment")

    return env.get(this.key).value
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    // @TODO: Move Error to Environment
    if (env.has(this.key) === false)
      throw new Error (this.key + " is not defined in environment")

    const expressions = env.get(this.key).value

    this.addExpressions(expressions)

    const values = this.expressions.map(expression => expression.evaluate())
    this.value = this.isEmpty ? null : this.isSingle ? values[0] : values
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Identity

},{"./Expression":32}],34:[function(require,module,exports){
const Expression = require("./Expression")

class Property extends Expression {

  constructor (key, expression) {
    super("Property", expression)
    this.key = key
    this.isEvaluated = false
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const expression = this.expressions[0].fetch(env)
    const property = expression.getProperty(this.key.name)

    // @TODO: Move calling function to getProperty
    this.value = typeof property === "function" ? property() : property

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Property

},{"./Expression":32}],35:[function(require,module,exports){
const Operation = require("./Operation")

class Arithmetic extends Operation {

  constructor (operator, ...operands) {
    const fix = operands.length > 1 ? "INFIX" : "PREFIX"
    super(fix, operator, ...operands)
    this.type = "Number"
  }

  typeCheck () {
    return this.type
  }

  evaluate () {
    const operator = this.operator
    const left = this.operands[0]
    const right = this.operands.length > 1 ? this.operands[1] : null
    const result = operator != null ? applyArithmetic(operator, left, right) : left
    this.value = result
    this.isEvaluated = true
    return this.value
  }
}

module.exports = Arithmetic

const applyArithmetic = (operator, left, right) => {
  switch (operator) {
  case "+":
    // positive
    if (right == null) return left
    // addition
    return left + right
  case "-":
    // negation
    if (right == null) return -left
    // subtraction
    return left - right
  case "*":
    return left * right
  case "/":
    return left / right
  case "**":
    return Math.pow(left, right)
  }
  // @TODO: Default case
}

},{"./Operation":37}],36:[function(require,module,exports){
const Operation = require("./Operation")

class BooleanLogic extends Operation {

  constructor (operator, ...operands) {
    const fix = operands.length > 1 ? "INFIX" : "PREFIX"
    super(fix, operator, ...operands)
    this.type = "Boolean"
  }

  typeCheck () {
    return this.type
  }

  evaluate () {
    const operator = this.operator
    const left = this.operands[0]
    const right = this.operands.length > 1 ? this.operands[1] : null
    const result = operator != null ? applyLogic(operator, left, right) : left
    this.value = result
    this.isEvaluated = true
    return this.value
  }
}

module.exports = BooleanLogic

const applyLogic = (operator, left, right) => {
  switch (operator) {
  case "!":
    return !left
  case "&":
    return left && right
  case "|":
    return left || right
  }
  // @TODO: Default case
}

},{"./Operation":37}],37:[function(require,module,exports){
const Expression = require("../Expression")

class Operation extends Expression {

  constructor (fix, operator, ...operands) {
    super("Operation")
    this.fix = fix
    this.operator = operator
    this.operands = operands
  }

  typeCheck () {

    const operands = this.operands.map(operand => operand.typeCheck())
    const firstOperand = operands[0]
    const operatorsMap = {
      "Boolean": ["&", "|", "!"],
      "Number": ["+", "-", "*", "/", "**", ",,"],
      "String": ["+"]
    }
    const operators = operatorsMap[firstOperand]

    // @TODO: Check number of operands (1 or 2 depending on operator)
    const equals = s => t => s === t
    if (!operators.includes(this.operator) || !operands.every(equals(firstOperand)))
      throw new Error ("Invalid operands for Operation")

    return firstOperand
  }

  evaluate (env) {

    // @TODO: Remove circulair references
    const BooleanLogic = require("./BooleanLogic")
    const Arithmetic = require("./Arithmetic")
    const StringConcatenation = require("./StringConcatenation")
    const Range = require("./Range")

    this.typeCheck()

    const operands = this.operands.map(operand => operand.evaluate(env))

    const t = typeof operands[0]
    const type =
      t === "boolean" ? "Boolean" :
        t === "string" ? "String" :
          t === "number" ? "Number" :
            (() => { throw new Error ("Invalid operand type") })()

    switch (type) {
    case "Boolean":
      return (new BooleanLogic(this.operator, ...operands)).evaluate()
    case "Number":
      if (this.operator === ",,") return (new Range(...operands)).evaluate()
      return (new Arithmetic(this.operator, ...operands)).evaluate()
    case "String":
      return (new StringConcatenation(...operands)).evaluate()
    }
  }
}

module.exports = Operation

},{"../Expression":32,"./Arithmetic":35,"./BooleanLogic":36,"./Range":38,"./StringConcatenation":39}],38:[function(require,module,exports){
const Operation = require("./Operation")
const Number = require("../scalars/Number")

class Range extends Operation {

  constructor (start, end) {
    super("INFIX", ",,", start, end)
    this.type = "Numbers"
  }

  typeCheck () {
    return this.type
  }

  evaluate (env) {
    if (this.isEvaluated) return this.value

    const start = this.operands[0]
    const end = this.operands[1]
    const range = this.createRange(start, end)

    const expressions = range.map(n => new Number(n))
    this.addExpressions(expressions)

    this.value = this.expressions.map(expression => expression.evaluate(env))
    this.isEvaluated = true
    return this.value
  }


  createRange (start, end) {

    if (start == null || end == null) throw new Error ("Invalid Range start or end")

    const isAscending = start <= end ? true : false
    const next = n => isAscending ? n + 1 : n - 1
    const hasEnded = n => isAscending ? n >= end : n <= end
    const range = []
    let i = start
    while (hasEnded(i) === false) {
      range.push(i)
      i = next(i)
    }
    range.push(end)

    return range

  }
}

module.exports = Range

},{"../scalars/Number":42,"./Operation":37}],39:[function(require,module,exports){
const Operation = require("./Operation")

class StringConcatenation extends Operation {

  constructor (...operands) {
    super("INFIX", "+", ...operands)
    this.type = "String"
  }

  typeCheck () {
    return this.type
  }

  evaluate () {
    const left = this.operands[0]
    const right = this.operands[1]
    this.value = concatStrings(left, right)
    this.isEvaluated = true
    return this.value
  }
}

module.exports = StringConcatenation

const concatStrings = (...str) => str.reduce((acc, cur) => acc + cur, "")

},{"./Operation":37}],40:[function(require,module,exports){
const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  isFalse: ({ value }) => () => value === false,
  isTrue: ({ value }) => () =>  value === true
})

class Boolean extends Scalar {

  constructor (value, literal) {
    super("Boolean", properties, value, literal)
  }

  parse (literal) {
    return literal === "true" ? true : false
  }
}

module.exports = Boolean

},{"../../types/setVisibilityProperties":65,"./Scalar":43}],41:[function(require,module,exports){
const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  is: false
})

class Null extends Scalar {

  constructor (value, literal) {
    super("Null", properties, value, literal)
  }

  parse () {
    return null
  }
}

module.exports = Null

},{"../../types/setVisibilityProperties":65,"./Scalar":43}],42:[function(require,module,exports){
const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  equals: ({ value }) => n => value === n
})

class Number extends Scalar {

  constructor (value, literal) {
    super("Number", properties, value, literal)
  }

  parse (literal) {
    const num = parseFloat(literal.replace(/_/g, ""))
    return isNaN(num) ? 0 : num
  }
}

module.exports = Number

},{"../../types/setVisibilityProperties":65,"./Scalar":43}],43:[function(require,module,exports){
const Expression = require("../Expression")

class Scalar extends Expression {

  constructor (type, properties, value, literal) {
    super(type, null, properties)
    this.value = value != null ? value : this.parse(literal)
    this.literal = literal
    this.isEvaluated = true
  }

  typeCheck () {
    return this.type
  }

  evaluate () {
    return this.value
  }
}

module.exports = Scalar

},{"../Expression":32}],44:[function(require,module,exports){
const Scalar = require("./Scalar")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const properties = setVisibilityProperties({
  concat: ({ value }) => s => value + s
})

class String extends Scalar {

  constructor (value, literal) {
    super("String", properties, value, literal)
  }

  parse (literal) {
    return literal
  }
}

module.exports = String

},{"../../types/setVisibilityProperties":65,"./Scalar":43}],45:[function(require,module,exports){
const Expression = require("../Expression")
const Statement = require("../statements/Statement")
const Type = require("../../types/Type")
const Function = require("./Function")
const toArray = require("../../../utils/toArray")

const isStatement = object => object instanceof Statement
const isApplication = object => object instanceof Application
const isType = object => object instanceof Type
const isFunctionExpression = object => object instanceof Function

class Application extends Expression {

  constructor (expression, args) {
    super("Application", expression)
    this.arguments = toArray(args)
  }

  evaluate (env) {

    if (this.isEvaluated) return this.value

    const firstExpression = this.expressions[0]

    let applicative = firstExpression.fetch(env)
    const args = this.arguments[0] && this.arguments[0].isPlural ? this.arguments[0].expressions : this.arguments

    // calling function to get buildins
    // @TODO: buildin statements as Function
    if (applicative.name === "buildInStatement") {
      applicative = applicative(args)
    }

    // apply (partial application)
    if (isApplication(applicative)) {
      applicative = applicative.evaluate(env)
    }

    if (isType(applicative)) {
      this.value = applicative.apply(args).evaluate(env)
    }
    else if (isFunctionExpression(applicative)) {
      // set Environment, only for anonymous function declarations
      if (applicative.hasEnvironment() === false) {
        applicative.setEnvironment(env)
      }
      this.value = applicative.apply(args)
    }
    // @TODO: type check statement
    // @TODO: Statement.apply
    else if (isStatement(applicative)) {
      this.value = applicative.apply(args)
    }
    else {
      throw new Error ("Can only apply Type, Function or Statement")
    }

    this.isEvaluated = true
    return this.value
  }
}

module.exports = Application

},{"../../../utils/toArray":70,"../../types/Type":63,"../Expression":32,"../statements/Statement":53,"./Function":48}],46:[function(require,module,exports){
const Assignment = require("../Assignment")
const Scope = require("./Scope")
const Environment = require("./Environment")

const isScope = object => object instanceof DataScope
const isAssignment = object => object instanceof Assignment
const isScopeOrAssignment = object => isScope(object) || isAssignment(object)

class DataScope extends Scope {

  evaluate (env) {
    if (this.isEmpty) return null
    const environment = env != null ? env.clone() : new Environment()
    this.value = this.evaluateDataScope(environment)
    this.isEvaluated = true
    const key = this.keys != null ? this.keys[0] : null
    return key != null ? { [key]: this.value } : this.value
  }

  evaluateDataScope (env) {

    this.expressions.forEach(expression => expression.evaluate(env))

    const evaluateToMap = this.expressions.every(isScopeOrAssignment)

    // create map e.g. ({ k: 5, l: 6 })
    if (evaluateToMap) {
      return this.expressions.reduce((acc, expression) => {
        expression.keys.forEach(key => acc[key] = expression.value)
        return acc
      }, {})
    }

    // create array e.g. ([5, 6, { k: 7 }])
    return this.expressions.map(expression => {
      if (isScopeOrAssignment(expression)) {
        return expression.keys.reduce((acc, key) => {
          acc[key] = expression.value
          return acc
        }, {})
      }
      return expression.value
    })
  }
}

module.exports = DataScope

},{"../Assignment":31,"./Environment":47,"./Scope":50}],47:[function(require,module,exports){
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

},{"../../../buildins/keys":2,"../../../buildins/types":3,"../../../utils/arrayLast":66}],48:[function(require,module,exports){
const Expression = require("../Expression")
const setVisibilityProperties = require("../../types/setVisibilityProperties")

const isFunctionExpression = object => object instanceof Function

const properties = setVisibilityProperties({
  apply: expression => args => expression.apply(args),
  parameters: ({ type }) => type != null ? type.inputTypes.map(type => type.fullName).join(", ") : "",
  arity: ({ type }) => type != null ? type.inputTypes.length : 0,
  returnType: ({ type }) => type != null ? type.types.map(type => type.fullName).join(", ") : "Any"
})

class Function extends Expression {

  constructor (type, scope, environment) {
    super(type, scope, properties)
    this.environment = environment // lexical scope
    this.isEvaluated = false
  }

  hasEnvironment () {
    return this.environment != null
  }

  setEnvironment (environment) {
    this.environment = environment
    return this
  }

  evaluate (env) {
    if (this.isEvaluated) return this.value
    this.setEnvironment(env)
    this.isEvaluated = true
    this.value = super.evaluate(env)
    return this.value
  }

  typeCheck (args) {
    // type check
    const inputTypes = this.type && this.type.inputTypes || []
    if (inputTypes.length > 0 && inputTypes.length !== args.length)
      throw new Error ("Invalid number of arguments for function application")
    inputTypes.map((inputType, index) => {
      const argument = args[index]
      if (argument === undefined)
        throw new Error ("Invalid number of arguments for function application")
      if (argument.type !== inputType.name)
        throw new Error ("Invalid argument for function application")
    })
  }

  apply (args) {

    this.typeCheck(args)

    const inputs = this.type != null ? this.type.inputTypes : []
    const argsObject = inputs.reduce((acc, type, index) => {
      acc[type.keys[0]] = args[index]
      return acc
    }, {})
    const environment = this.environment.setArgs(argsObject)
    const expression = this.expressions[0]
    return isFunctionExpression(expression) ? expression : expression.evaluate(environment, args)
  }
}

module.exports = Function

},{"../../types/setVisibilityProperties":65,"../Expression":32}],49:[function(require,module,exports){
const Scope = require("./Scope")
const Assignment = require("../Assignment")
const Application = require("./Application")
const Statement = require("../statements/Statement")
const ConditionalStatement = require("../statements/ConditionalStatement")
const Identity = require("../Identity")
const Environment = require("./Environment")

const toArray = require("../../../utils/toArray")
const { isLast } = require("../../../utils/arrayLast")

const isScope = object => object instanceof Scope
const isApplication = object => object instanceof Application
const isStatement = object => object instanceof Statement
const isAssignment = object => object instanceof Assignment
const isScopeOrAssignment = object => isScope(object) || isAssignment(object)
const isReturnStatement = object => object instanceof Statement && object.name === "return"
const isPrintStatement = object => object instanceof Statement && ["print", "log", "debug"].includes(object.name)
const isPrimaryConditionalStatement = object => object instanceof ConditionalStatement && ["if", "elseif"].includes(object.name)
const isSecondaryConditionalStatement = object => object instanceof ConditionalStatement && ["elseif", "else"].includes(object.name)

class FunctionScope extends Scope {

  constructor (keys = [], expressions = []) {
    super(keys, expressions)
  }

  evaluate (env) {
    if (this.isEmpty) return null
    const environment = env != null ? env.clone() : new Environment()
    // @TODO: Move to Environment
    Object.keys(this.types).forEach(key => environment.set(key, this.types[key], true))
    this.value = this.evaluateFunctionScope(environment)
    this.isEvaluated = true
    return this.value
  }

  evaluateFunctionScope (env) {

    const initialScope = { hasReturned: false, returnValue: null, env }

    const evaluatedScope = this.expressions.reduce((scope, expression, index, arr) => {

      if (scope.hasReturned) return scope

      // Application
      if (isApplication(expression)) {
        const evaluated = expression.evaluate(scope.env)
        if (isStatement(evaluated)) {
          expression = evaluated
        }
      }

      // Assignment
      if (isScopeOrAssignment(expression)) {
        const expressions = isScope(expression) ? expression :
          expression.expressions.length === 1 ? expression.expressions[0] :
            expression.expressions
        toArray(expressions).forEach(expression => expression.evaluate(env))
        expression.keys.forEach(key => scope.env.set(key.name, expressions))
      }
      // Conditional Statements
      else if (isSecondaryConditionalStatement(expression)) {

        const previousExpression = arr[index - 1]

        if (!isPrimaryConditionalStatement(previousExpression))
          throw new Error ("ConditionalStatement " + expression.name + " should be preceded by if Statement")

        if (previousExpression.value[0] === false) {
          expression.evaluate(scope.env)
        } else {
          expression.doNotEvaluate(previousExpression.value[1])
        }
      }
      // Expression
      else {
        expression.evaluate(scope.env)
      }

      // print
      if (isPrintStatement(expression)) {
        // @TODO: Move logic into PrintStatement
        const name = expression.name
        const val = toArray(expression.value).join(", ")
        const expression0 = expression.expressions[0]
        // @TODO: Type for Plural
        // Reading name from Application > Type
        const type = expression0 instanceof Identity ? expression0.expressions[0].expressions[0].name : expression0.type
        const value =
          name === "print" ? val :
            name === "log" ? new Date().toLocaleString() + " " + val :
              name === "debug" ? type + " " + val :
                (() => { throw new Error ("Invalid Print Statement") })()
        // eslint-disable-next-line no-console
        console.log(value)
      }

      // return
      if (isReturnStatement(expression) || isLast(index, arr)) {
        scope.returnValue = isScope(expression) ? expression : expression.value
        scope.hasReturned = true
      }

      return scope
    }, initialScope)

    return evaluatedScope.returnValue
  }
}

module.exports = FunctionScope

},{"../../../utils/arrayLast":66,"../../../utils/toArray":70,"../Assignment":31,"../Identity":33,"../statements/ConditionalStatement":51,"../statements/Statement":53,"./Application":45,"./Environment":47,"./Scope":50}],50:[function(require,module,exports){
const Expression = require("../Expression")

const toArray = require("../../../utils/toArray")

class Scope extends Expression {

  constructor (keys = [], expressions = [], properties = {}) {
    super("Scope", expressions, properties)
    this.keys = toArray(keys)
    this.types = {}
  }

  addType (name, type) {
    this.types[name] = type
  }
}

module.exports = Scope

},{"../../../utils/toArray":70,"../Expression":32}],51:[function(require,module,exports){
const Statement = require("./Statement")

const isIf = name => ["if", "elseif"].includes(name)

class ConditionalStatement extends Statement {

  evaluate (env) {

    if (this.isEvaluated) return this.value

    let condition, consequent

    if (isIf(this.name)) {
      if (this.expressions.length !== 2) throw new Error ("if / elseif statement should have 2 arguments")
      condition = this.expressions[0]
      condition.evaluate(env)
      if (condition.type !== "Boolean") throw new Error ("if / elseif statement's first argument should be a Boolean")
      consequent = this.expressions[1]
    } else {
      if (this.expressions.length !== 1) throw new Error ("else statement should have 1 argument")
      consequent = this.expressions[0]
    }

    if (consequent.type !== "Scope") throw new Error ("if / elseif / else statement's last argument should be a Scope")

    if (isIf(this.name)) {
      this.value = condition.value === true ? [true, consequent.evaluate(env)] : [false, null]
    } else {
      this.value = consequent.evaluate(env)
    }
    this.isEvaluated = true
    return this.value
  }

  doNotEvaluate (previousValue) {
    this.isEvaluated = true
    if (isIf(this.name)) {
      this.value = [true, previousValue]
    } else {
      this.value = previousValue
    }
    return this.value
  }
}

module.exports = ConditionalStatement

},{"./Statement":53}],52:[function(require,module,exports){
const Statement = require("./Statement")

class ForStatement extends Statement {

  evaluate (env) {

    if (this.isEvaluated) return this.value

    if (this.expressions.length !== 2) throw new Error ("for statement should have 2 arguments")

    const loop = this.expressions[1]
    if (loop.type !== "Scope") throw new Error ("for statement's second argument should be a Scope")

    const expression = this.expressions[0]
    const value = expression.evaluate(env)
    const arr =
      expression.type === "Number" ? new Array(value).fill(null) :
        expression.isPlural ? expression.expressions :
          value // Range

    this.value = arr.map(() => loop.evaluate(env))
    this.isEvaluated = true
    return this.value
  }
}

module.exports = ForStatement

},{"./Statement":53}],53:[function(require,module,exports){
const Expression = require("../Expression")

class Statement extends Expression {

  constructor (name, expressions) {
    super("Statement", expressions)
    this.name = name
  }

  apply (args) {
    this.arguments = args
    return this
  }
}

module.exports = Statement

},{"../Expression":32}],54:[function(require,module,exports){
module.exports = class Comment {

  constructor (chars) {
    this.chars = chars
  }
}

},{}],55:[function(require,module,exports){
module.exports = class Gibberish {

  constructor (chars) {
    this.chars = chars
  }
}

},{}],56:[function(require,module,exports){
class Indent {
  constructor (indents) {
    this.level = indents.length
    this.chars = indents.flat().join("")
  }
}

module.exports = Indent

},{}],57:[function(require,module,exports){
const {
  pipeParsers,
  mapTo,
  sequenceOf,
  many,
  possibly,
  anythingExcept,
  choice,
  parse,
  toValue
} = require("arcsecond")

const {
  escapedBackslash,
  numberSign
} = require("../../parsers/convenience/tokens")

const charsToString = require("../../utils/charsToString")

const escapedNumberSign = sequenceOf([escapedBackslash, numberSign])

const Comment = require("./Comment")
const Identity = require("../expressions/Identity")
const ScopeOpener = require("../text/ScopeOpener")
const TypeOpener = require("../text/TypeOpener")
const TypeConstructor = require("../types/TypeConstructor")

const comment = pipeParsers([
  sequenceOf([
    numberSign,
    many(anythingExcept(escapedNumberSign)),
    possibly(escapedNumberSign)
  ]),
  mapTo(sequence => new Comment(charsToString(sequence)))
])

const commentsFilter = many(
  choice([
    comment,
    many(anythingExcept(numberSign))
  ])
)

class Line {

  constructor (chars, lineNumber, indents = 0) {
    this.chars = chars
    this.lineNumber = lineNumber
    this.indents = indents
    // @TODO: This is not always set correctly
    this.parsedComments = this.parseComments(chars)
    this.content = charsToString(this.parsedComments)
    this.isComment = this.parsedComments.length === 1 && this.parsedComments[0] instanceof Comment
    this.isEmpty = this.isComment === false && this.content.trim() === ""
  }

  parseComments (chars) {
    return this.filterComments(chars.trim())
  }

  filterComments (chars) {
    try {
      return toValue(parse(commentsFilter)(chars))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  setParsedContent (parsedContent) {
    this.parsedContent = parsedContent
    // @TODO: Remove TypeOpener
    const scopeOpeners = [Identity, ScopeOpener, TypeOpener, TypeConstructor]
    this.canOpenScope = scopeOpeners.reduce((acc, opener) => acc || this.parsedContent instanceof opener, false)
  }
}

module.exports = Line

},{"../../parsers/convenience/tokens":10,"../../utils/charsToString":67,"../expressions/Identity":33,"../text/ScopeOpener":59,"../text/TypeOpener":60,"../types/TypeConstructor":64,"./Comment":54,"arcsecond":4}],58:[function(require,module,exports){

// Tree node = line, children = ScopeLines
class ScopeLine {

  constructor (line) {
    this.line = line || null
    this.scopeLines = []
    this.isEmpty = true
    this.numScopeLines = 0
  }

  addScopeLine (scopeLine) {
    this.scopeLines.push(scopeLine)
    this.isEmpty = false
    this.numScopeLines = this.scopeLines.length
  }

  getScopeLine (index) {
    return this.scopeLines[index]
  }
}

module.exports = ScopeLine

},{}],59:[function(require,module,exports){
class ScopeOpener {
  constructor (key, functionType) {
    this.key = key
    this.functionType = functionType
    this.isFunction = this.functionType != null
  }
}

module.exports = ScopeOpener

},{}],60:[function(require,module,exports){
class TypeOpener {
  constructor (name) {
    this.name = name
  }
}

module.exports = TypeOpener

},{}],61:[function(require,module,exports){
class TypeScope {

  constructor (name) {
    this.name = name
    this.types = []
    this.properties = []
    this.isEmpty = true
  }

  addType (type) {
    this.types.push(type)
    this.isEmpty = false
  }

  addProperty (property) {
    this.properties.push(property)
    this.isEmpty = false
  }
}

module.exports = TypeScope

},{}],62:[function(require,module,exports){
const toArray = require("../../utils/toArray")

class FunctionType {

  constructor (inputs, returnType) {
    this.inputs = toArray(inputs)
    this.returnType = returnType
  }
}

module.exports = FunctionType

},{"../../utils/toArray":70}],63:[function(require,module,exports){
const setVisibilityProperties = require("./setVisibilityProperties")
const toArray = require("../../utils/toArray")
const isEmpty = arr => arr == null || arr.length === 0
const notEmpty = arr => isEmpty(arr) === false

const Null = require("../expressions/scalars/Null")
const Boolean = require("../expressions/scalars/Boolean")
const Number = require("../expressions/scalars/Number")
const String = require("../expressions/scalars/String")
const Expression = require("../expressions/Expression")

class Type {

  constructor (name, options, types, inputTypes, keys, properties = null, depth = null, isScalar = false) {

    this.options = toArray(options)
    this.types = toArray(types)
    this.isCompound = this.types.length > 1

    this.inputTypes = toArray(inputTypes)
    this.isFunction = this.inputTypes.length > 0

    this.keys = toArray(keys)
    this.name = name != null ? name : this.createName()
    this.fullName = this.createFullName()

    this.setProperties(toArray(properties))

    this.depth = toArray(depth)
    this.isPlural = this.depth.length > 0
    this.isScalar = isScalar
  }

  createName () {
    // Sum type
    if (notEmpty(this.options)) return this.options.map(option => option.name).join(" | ")
    // Product type
    if (isEmpty(this.inputTypes)) return this.types.map(type => type.fullName).join(", ")
    // Function type
    return this.inputTypes.map(type => type.fullName).join(", ") + " -> " + this.types.map(type => type.name).join(", ")
  }

  createFullName () {
    return this.keys.map(key => key.name + ": ").join("") + this.name
  }

  setProperties (properties) {
    this.properties = properties.reduce((acc, property) => {
      const key = property.keys[0]
      acc[key.name] = {
        property: property.expressions[0].value,
        visibility: key.visibility
      }
      return acc
    }, {})
  }

  fetch (env) {
    const value = env.get(this.name)
    if (value === undefined || value.isType === false)
      throw new Error (this.name + " is not a Type")
    return value.value
  }

  apply (args) {
    const argsArray = toArray(args)
    if (this.isPlural) {
      return castToPlural(this.name, this.types[0].name, argsArray)
    }
    else if (this.isCompound) {

      if (this.types.length !== argsArray.length)
        throw new Error ("Invalid number of arguments for " + this.name)

      this.types.map((type, index) => {
        const argument = argsArray[index]
        if (argument.type !== type.name)
          throw new Error ("Invalid argument for " + this.name)
      })

      return castToCompound(this.name, this.types, this.properties, argsArray)
    }
    else if (this.isScalar) {
      if (args.length === 0)
        throw new Error ("Invalid number of arguments for Type casting")
      const arg0 = castToScalar(this.name, argsArray[0].evaluate())
      return argsArray.length > 1 ? new Expression(null, [arg0, ...argsArray.slice(1)]) : arg0
    }
  }
}

// @TODO: Rename to createScalar
const castToScalar = (name, value) => {
  const str = value + ""
  let ret
  switch (name) {
  case "Null":
    ret = new Null (null, str)
    break
  case "Boolean":
    ret = new Boolean (null, str)
    break
  case "Number":
    ret = new Number (null, str)
    break
  case "String":
    ret = new String (null, str)
    break
  }
  return ret
}

// @TODO: Rename to createCompound
const castToCompound = (name, types, properties, values) => {
  const filterPropertiesByVisibility = (properties, visibility) => Object.keys(properties).reduce((acc, name) => {
    const property = properties[name]
    if (property.visibility === visibility) acc[name] = property
    return acc
  }, {})
  const privateProperties = { ...setVisibilityProperties({ init: () => expressions => expressions }, "PRIVATE"), ...filterPropertiesByVisibility(properties, "PRIVATE") }
  const convenienceProperties = filterPropertiesByVisibility(properties, "CONVENIENCE")
  const propertiesFromTypes = types.reduce((acc, type, index) => {
    // @TODO: Multiple keys
    const key = type.keys[0]
    acc[key] = ({ value }) => value[index]
    return acc
  }, {})
  const dataProperties = setVisibilityProperties(propertiesFromTypes, "DATA")
  return new Expression (name, values, { ...privateProperties, ...convenienceProperties, ...dataProperties })
}

// @TODO: Rename to createPlural
const castToPlural = (name, type, values) =>
  new Expression (name, values.map(value => castToScalar(type, value.evaluate())))

module.exports = Type

},{"../../utils/toArray":70,"../expressions/Expression":32,"../expressions/scalars/Boolean":40,"../expressions/scalars/Null":41,"../expressions/scalars/Number":42,"../expressions/scalars/String":44,"./setVisibilityProperties":65}],64:[function(require,module,exports){
class TypeConstructor {
  constructor (name, type) {
    this.name = name
    this.type = type || name
  }
}
module.exports = TypeConstructor

},{}],65:[function(require,module,exports){
const setVisibilityProperties = (properties, visibility = "CONVENIENCE") =>
  Object.keys(properties).reduce((acc, key) => {
    const property = properties[key]
    acc[key] = { key, visibility, property }
    return acc
  }, {})

module.exports = setVisibilityProperties

},{}],66:[function(require,module,exports){
const last = arr => arr[arr.length - 1]
const isLast = (index, arr) => arr.length - 1 === index

module.exports = {
  last,
  isLast
}

},{}],67:[function(require,module,exports){
const {
  isString
} = require("./is")

module.exports = (...chars) =>
  chars.flat(Infinity).filter(isString).join("")

},{"./is":68}],68:[function(require,module,exports){
const isString = value => typeof value === "string"
const isArray = value => Array.isArray(value)
const isFunction = value => typeof value === "function"

module.exports = {
  isString,
  isArray,
  isFunction
}

// @TODO: Partial application
// is(Any): (global)
// is: (not null)
// is(String): type / instance

},{}],69:[function(require,module,exports){
const reduceStringsToObject = (strings, map) =>
  strings.reduce((acc, str) => {
    acc[str] = map !== undefined ? map(str) : str
    return acc
  }, {})

module.exports = reduceStringsToObject

},{}],70:[function(require,module,exports){
const toArray = items => {
  if (Array.isArray(items)) return items
  if (items != null) return [items]
  return []
}

module.exports = toArray

},{}]},{},[1]);
