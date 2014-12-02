var vows = require('vows'),
    merge = require('../lib/merge'),
    assert = require('assert');

vows.describe('util.merge').addBatch({
  'When merging two complex objects': {
    topic: function() {
      return merge(
        { foo: { bar: { text2: 'World', text3: 'Trade Center' }}},
        { foo: { bar: { text: 'Hello', text2: 'WTF' }}}
      );
    },

    'does not discard values from any input': function (topic) {
      assert.equal (topic.foo.bar.text, 'Hello');
      assert.equal (topic.foo.bar.text2, 'World');
      assert.equal (topic.foo.bar.text3, 'Trade Center');
    },
    'prioritises former values over latter': function (topic) {
      assert.equal(topic.foo.bar.text2, 'World');
    }
  }
}).export(module); // Export the Suite
