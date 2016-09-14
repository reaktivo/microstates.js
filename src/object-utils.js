import assign from './assign';

/**
 * Maps over the keys of an object converting the values of those keys into new
 * objects. The return value will be an object with the same set of
 * keys, but a different set of values. E.g.
 *
 * > mapObject({first: 1, second: 2}, (value)=> value *2)
 *
 *   {first: 2, second: 4}
 */
export function mapObject(object = {}, fn) {
  return reduceObject(object, function(result, name, value) {
    return assign(result, { [name]: fn(name, value) });
  });
}

export function reduceObject(object, fn, result = {}) {
  eachProperty(object, function(name, value) {
    result = fn(result, name, value);
  });
  return result;
}

export function filterObject(object, fn) {
  return reduceObject(object, function(results, name, value) {
    if (fn(name, value)) {
      return assign(results, { [name]: value });
    } else {
      return results;
    }
  });
}

/**
 * Iterates over all enumerable properties of an object, including
 * those contained within its prototype chain, and invokes a callback
 * for each key and value contained therein.
 *
 * The callback function will be invoked with both the name of the
 * property and the property value:
 *
 *   eachProperty({hello: 'world'}, function(name, value) {
 *     console.log(`${name} -> ${value}`);
 *   });
 *
 *   //=> hello -> world
 *
 * Note: If the callback function does not consume the value, but only
 * uses the name of the property, then it does not actually access
 * that value. This is to allow lazy properties to remain
 * un-computed.
 *
 * @param {Object} object - the object to walk
 * @param {Function} fn - the callback
 */
export function eachProperty(object, fn) {
  for (let holder = object; holder; holder = Object.getPrototypeOf(holder)) {
    Object.keys(holder).forEach(function(name) {
      let value;
      if (fn.length > 1) {
        value = holder[name];
      }
      fn.call(holder, name, value);
    });
  }
}

export function reduceChain(object, fn, result = {}) {
  for (let holder = object; holder; holder = Object.getPrototypeOf(holder)) {
    Object.keys(holder).forEach(function(name) {
      result = fn.call(holder, result, name);
    });
  }
  return result;
}
