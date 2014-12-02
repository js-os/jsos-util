exports = module.exports = substitute;

/**
 * Substitute the values in the string based on the given dictionary.
 * Based on https://github.com/npm/npmconf/blob/master/npmconf.js
 *
 * @alias module:jsos-util.substitute
 * @example
 * ```js
 * var substitute = require("jsos-util").substitute; // alt: require("jsos-util/lib/substitute");
 * var value = substitute('${HOME}/.jsos/cache', process.env);
 * // 'home/lauri/.jsos/cache'
 * console.log(value);
 * ```
 * @param {string} str The string to substitute
 * @param {Object} [dict={}] dict The dictionary to use for substitution
 * @return {string} The string after substitutions; str if str is not a string
 */

function substitute(str, dict) {
  var re = /(\\*)\$\{([^}]+)\}/g;

  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(re, function (orig, esc, key) {
    var value;

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
