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

exports = module.exports = {
  substitute: require("./substitute"),
  mapNested: require("./map-nested"),
  merge: require("./merge"),
  parseConfig: require("./parse-config")
};
