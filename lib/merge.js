exports = module.exports = merge;

/**
 * Merge several objects into one, prioritising the values of former over the latter
 * (left overwrites right) and recursing into nested objects.
 *
 * @alias module:jsos-util.merge
 * @example
 * ```js
 * var merge = require("jsos-util").merge; // alt: require("jsos-util/lib/merge");
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
  var sourceValue,
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
    var key;

    // Start to traverse the object. Each value in the stack contains
    // source-destination pairs of values, so that we can recurse easily.
    stack = [[source, destination]];

    while(pair = stack.pop()) { // jshint ignore:line
      currentSource = pair[0];
      currentDestination = pair[1];

      for (key in currentSource) { // jshint ignore:line

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
