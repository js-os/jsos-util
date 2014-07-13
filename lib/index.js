/** 
 * JSOS Utility belt with minimal 3rd party dependencies. This is mainly meant to be reused
 * with JSOS, but because of no inter-dependencies, the utilities are largely reusable elsewhere.
 *
 * @module jsos-util
 * @alias util
 * @example
 * ```js
 * var util = require('jsos-util');
 * ```
 */
var util = require('util'),
    fs = require('fs');

/**
 * Substitute the values in the string based on the given dictionary.
 * Based on https://github.com/npm/npmconf/blob/master/npmconf.js
 *
 * @alias module:jsos-util.substitute
 * @example
 * ```js
 * var value = substitute('${HOME}/.jsos/cache', process.env);
 * // 'home/lauri/.jsos/cache'
 * console.log(value);
 * ```
 * @param {string} str The string to substitute
 * @param {Object} [dict={}] dict The dictionary to use for substitution
 * @return {string} The string after substitutions; str if str is not a string
 */
 function substitute(str, dict) {
  var re = /(\\*)\$\{([^}]+)\}/g,
      error;

  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(re, function (orig, esc, key, i, s) {
    var value,
        key;

    esc = esc.length && esc.length % 2;
    if (esc) {
      return orig;
    }

    value = dict[key];

    if (typeof value === 'undefined') {
      return '';
    }

    return value;
  });
}

/**
 * Walks through the whole object, including its nested properties
 * in the same way as Array.forEach. Note that it does not function for
 * objects having loops and will eventually fail in stack overflow.
 *
 * @alias module:jsos-util.mapNested
 * @example
 * ```js 
 * // baz says Hello
 * mapNested({ foo: { bar: { baz: 'Hello'}}], function(key, value) {
 *   console.log(key, 'says', value);
 * });
 * ```
 * @param {Object} source The object to visit/walk through
 * @param {function} fun The function to execute 
 * @return {Object} A new Object with the same structure as source and fun executed for each member
 *
 * @todo Handle the infinite recursion by keeping log of processed values
 */
function mapNested(source, fun) {
  var key,
      value,
      destination = {},
      destinationValue;

  for (key in source) {
    if (!source.hasOwnProperty(key)) {
      continue;
    }

    value = source[key];

    if (typeof value === 'object') {
      // Arrays get recognised as object
      if (Array.isArray(value)) {
        destinationValue = value.map(fun);
      }
      else {
        destinationValue = mapNested(value, fun);
      }
    }
    else {
      destinationValue = value = fun(value);
    }

    destination[key] = destinationValue;
  }

  return destination;
}

/**
 * Merge several objects into one, prioritising the values of former over the latter and
 * recursing into subobjects.
 *
 * @alias module:jsos-util.merge
 * @example
 * ```js 
 * var value = merge({ foo: { bar: { text2: 'World'}}, { foo: { bar: { text: 'Hello', text2: 'WTF' }})
 * // { foo: { bar: { text: 'Hello', text2: 'World' }}}
 * console.log(value);
 * ```
 * @param {Object} source Object The first object to merge
 * @param {...Object} sourceN One or more objects to merge to the source
 * @return {Object} The results of merging the objects
 *
 * @todo Handle the infinite recursion by keeping log of processed values
 */
 function merge() {
  // Start the return value from scratch
  var key,
      sourceValue,
      sourceType,
      destinationValue,
      currentSource,
      currentDestination,
      destination = {},
      pair,
      stack,
      args;

  // Proceed in reverse order, so that the former values get
  // priority over the latter values
  args = Array.prototype.slice.call(arguments).reverse();
  args.forEach(function(source) {
    // Start to traverse the object. Each value in the stack contains 
    // source-destination pairs of values, so that we can recurse easily.
    stack = [[source, destination]];

    while(pair = stack.pop()) {
      currentSource = pair[0];
      currentDestination = pair[1];

      for (key in currentSource) {

        if (!currentSource.hasOwnProperty(key)) {
          continue;
        }

        sourceValue = currentSource[key];
        sourceType = typeof sourceValue;

        if (sourceType === 'undefined') {
          continue;
        }

        if (sourceType !== 'object') {
          // The source value is a simple value - use it as-is
          currentDestination[key] = sourceValue;
          continue;
        }

        // If the sourceValue is an object, push the pair into stack. If the destination
        // doesn't already have the given key-value, create it.
        destinationValue = currentDestination[key];
        if (typeof destinationValue !== 'object') {
          currentDestination[key] = destinationValue = {};
        }

        stack.push([sourceValue, destinationValue]);
      }
    }
  });

  return destination;
 }

/**
 * Parses one or many file configurations, supplemented by defaults.
 * The defaults given in the end are optional.
 *
 * @alias module:jsos-util.parseConfig
 * @example
 * ```js 
 * parseConfig('.jsos-initc', '/etc/jsos-initrc', { foo: 'bar' });
 * parseConfig('.jsos-initc', '/etc/jsos-initrc');
 * ```
 * @param {...string} path Zero or more configuration file paths to parse
 * @param {Object} [defaults={}] The configuration defaults
 * @return {Object} All the configurations flattened into one object
 */
  function parseConfig() {
  var defaults = {},
      paths;

  if (arguments.length === 0) {
    return null;
  }

  paths = Array.prototype.slice.call(arguments);
  if (typeof paths[paths.length-1] === 'object') {
    defaults = paths.pop();
  }

  // Parse the paths and merge them
  return paths.map(function(fileName) {
    var filePath = substitute(fileName, process.env),
        buffer;

    if (!fs.existsSync(filePath)) {
      console.log(filePath, 'not found');
      return;
    }

    buffer = fs.readFileSync(filePath);

    if (!buffer) {
      return;
    }
    return JSON.parse(buffer);
  })
  .concat([ defaults ])
  .reduce(function(previous, current) {
    var parsed;

    if (!current) {
      return previous;
    }

    parsed = mapNested(current, function(val) {
      return substitute(val, process.env);
    });

    return merge(previous, parsed);
  }, {});
}

exports = module.exports = {
  substitute: substitute,
  mapNested: mapNested,
  merge: merge,
  parseConfig: parseConfig
}