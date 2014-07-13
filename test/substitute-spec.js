var vows = require('vows'),
    util = require('..'),
    assert = require('assert');

var fixture = {
      single: '${HOME}/.jsos',
      multiple: '/foo${HOME}/bar${TEMP}/baz',
      undef: '/foo/${UNDEFINED}/bar',
      missing: '/foo/${MISSING}/bar'
    },
    dictionary = { 
      HOME: '/home/lauri',
      TEMP: '/tmp',
      UNDEFINED: undefined,
    };

vows.describe('util.substitute').addBatch({
  'When substituting variables using a dictionary': {
    topic: function() {
      var results = {
        original: fixture,
        substituted: {}
      };

      for (key in fixture) {
        results.substituted[key] = util.substitute(fixture[key], dictionary);
      }

      return results;
    },

    'single values get substituted': function(topic) {
      assert.equal(topic.substituted.single, '/home/lauri/.jsos');
    },
    'multiple values get substituted': function (topic) {
      assert.equal(topic.substituted.multiple, '/foo/home/lauri/bar/tmp/baz');
    },
    'undefined values get treated as blank': function (topic) {
      assert.equal(topic.substituted.undef, '/foo//bar');
    },
    'undefined keys get treated as blank': function (topic) {
      assert.equal(topic.substituted.missing, '/foo//bar');
    },
    'Original values remain intact': function (topic) {
      assert.equal(topic.original.single, '${HOME}/.jsos');
    }
  }
}).export(module); // Export the Suite