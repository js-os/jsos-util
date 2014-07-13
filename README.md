[![view on npm](http://img.shields.io/npm/v/jsos-util.svg)](https://www.npmjs.org/package/jsos-util)
[![npm module downloads per month](http://img.shields.io/npm/dm/jsos-util.svg)](https://www.npmjs.org/package/jsos-util)
[![Build Status](https://api.travis-ci.org/js-os/jsos-util.svg?branch=master)](https://travis-ci.org/js-os/jsos-util)
[![Dependency Status](https://david-dm.org/js-os/jsos-util.svg)](https://david-dm.org/js-os/jsos-util)

<a name="module_jsos-util"></a>
#jsos-util
JSOS Utility belt with minimal 3rd party dependencies. This is mainly meant to be reused
with JSOS, but because of no inter-dependencies, the utilities are largely reusable elsewhere.

**Example**  
```js
var util = require('jsos-util');
```

**Members**

* [util.substitute(str, [dict])](#module_jsos-util.substitute)
* [util.mapNested(source, fun)](#module_jsos-util.mapNested)
* [util.merge(source, ...sourceN)](#module_jsos-util.merge)
* [util.parseConfig(...path, [defaults])](#module_jsos-util.parseConfig)

<a name="module_jsos-util.substitute"></a>
##util.substitute(str, [dict])
Substitute the values in the string based on the given dictionary.
Based on https://github.com/npm/npmconf/blob/master/npmconf.js

**Params**

- str `string` - The string to substitute
- [dict={}] `Object` - dict The dictionary to use for substitution

**Returns**: `string` - The string after substitutions; str if str is not a string  
**Example**  
```js
var value = substitute('${HOME}/.jsos/cache', process.env);
// 'home/lauri/.jsos/cache'
console.log(value);
```

<a name="module_jsos-util.mapNested"></a>
##util.mapNested(source, fun)
Walks through the whole object, including its nested properties
in the same way as Array.forEach. Note that it does not function for
objects having loops and will eventually fail in stack overflow.

**Params**

- source `Object` - The object to visit/walk through
- fun `function` - The function to execute

**Returns**: `Object` - A new Object with the same structure as source and fun executed for each member  
**Example**  
```js 
// baz says Hello
mapNested({ foo: { bar: { baz: 'Hello'}}], function(key, value) {
  console.log(key, 'says', value);
});
```

<a name="module_jsos-util.merge"></a>
##util.merge(source, ...sourceN)
Merge several objects into one, prioritising the values of former over the latter and
recursing into subobjects.

**Params**

- source `Object` - Object The first object to merge
- ...sourceN `Object` - One or more objects to merge to the source

**Returns**: `Object` - The results of merging the objects  
**Example**  
```js 
var value = merge({ foo: { bar: { text2: 'World'}}, { foo: { bar: { text: 'Hello', text2: 'WTF' }})
// { foo: { bar: { text: 'Hello', text2: 'World' }}}
console.log(value);
```

<a name="module_jsos-util.parseConfig"></a>
##util.parseConfig(...path, [defaults])
Parses one or many file configurations, supplemented by defaults.
The defaults given in the end are optional.

**Params**

- ...path `string` - Zero or more configuration file paths to parse
- [defaults={}] `Object` - The configuration defaults

**Returns**: `Object` - All the configurations flattened into one object  
**Example**  
```js 
parseConfig('.jsos-initc', '/etc/jsos-initrc', { foo: 'bar' });
parseConfig('.jsos-initc', '/etc/jsos-initrc');
```

