exports = module.exports = mapNested;

/**
 * Walks through the whole object, including its nested properties
 * in the same way as Array.forEach. Note that it does not function for
 * objects having loops and will eventually fail in stack overflow.
 *
 * @alias module:jsos-util.mapNested
 * @example
 * ```js
 * // baz says Hello
 * var mapNested = require("jsos-util").mapNested; // alt: require("jsos-util/lib/map-nested");
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

  for (key in source) { // jshint ignore:line
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
