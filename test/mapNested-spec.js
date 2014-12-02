var vows = require('vows'),
    mapNested = require('../lib/map-nested'),
    assert = require('assert');

var fixture = {
      foo: {
        bar: {
          inBetween: 'In between',
          baz: {
            text: 'Test',
            numeric: 123
          }
        },
        baz: {
        }
      }
    };

function mapper(value) {
  return value + ' OK';
}

vows.describe('util.mapNested').addBatch({
  'When traversing a complex object': {
    topic: function() {
      var results = {
        original: fixture,
        mapped: mapNested(fixture, mapper)
      };

      return results;
    },

    'Values get mapped in different levels of recursion': function(topic) {
      assert.equal(topic.mapped.foo.bar.inBetween, 'In between OK');
      assert.equal(topic.mapped.foo.bar.baz.text, 'Test OK');
      assert.equal(topic.mapped.foo.bar.baz.numeric, '123 OK');
    },
    'Original object remains intact': function (topic) {
      assert.equal(topic.original.foo.bar.inBetween, 'In between');
    }
  }
}).export(module); // Export the Suite
