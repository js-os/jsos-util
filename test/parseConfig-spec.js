var vows = require('vows'),
    util = require('..'),
    assert = require('assert');

var defaults = {
      npm: {
        prefix: '.jsos',
        cache: '.jsos/cache'
      },
      onlyInDefaults: true,
      defaultsToSubstitute: '${HOME}'
    };

vows.describe('util.parseConfig').addBatch({
  'When loading several config files': {
    topic: function() {
      return util.parseConfig('test/parseConfig-fixture2.json', 'test/parseConfig-fixture1.json');
    },

    'Every configuration gets read': function(topic) {
      assert.equal(topic.onlyInFixture2, true);
      assert.equal(topic.onlyInFixture1, true);
    },
    'Config file preference order is from first to last to defaults': function(topic) {
      assert.equal(topic.npm.prefix, '/home/lauri/.jsos');
    },
    'Variables get substituted': function (topic) {
      var hasUnsubstitutedVariable = topic.npm.prefix.match('${HOME}') !== null;
      assert.equal(hasUnsubstitutedVariable, false);
    }
  },
  'When loading several config files & defaults': {
    topic: function() {
      return util.parseConfig('test/parseConfig-fixture2.json', 'test/parseConfig-fixture1.json', defaults);
    },
    'Defaults get the least priority': function (topic) {
      assert.equal(topic.npm.prefix !== '.jsos', true);
    },    
    'Defaults get included': function (topic) {
      assert.equal(topic.onlyInDefaults, true);
    },
    'Variables in defaults substituted': function (topic) {
      var hasUnsubstitutedVariable = topic.defaultsToSubstitute.match('${HOME}') !== null;
      assert.equal(hasUnsubstitutedVariable, false);
    },

  }
}).export(module); // Export the Suite