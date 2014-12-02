var fs = require("fs");
var substitute = require("./substitute");
var mapNested = require("./map-nested");
var merge = require("./merge");

exports = module.exports = parseConfig;

/**
 * Parses one or many file configurations, supplemented by defaults.
 * The defaults given in the end are optional.
 *
 * @alias module:jsos-util.parseConfig
 * @example
 * ```js
 * var parseConfig = require("jsos-util").parseConfig; // alt: require("jsos-util/lib/parse-config");
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
      console.error(filePath, 'not found');
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
