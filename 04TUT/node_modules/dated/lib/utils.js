var hasOwn = Object.prototype.hasOwnProperty;

exports.properties = properties;
exports.lengthSort = lengthSort;

function properties(object, options) {
  if (options === true)
    options = {functions: true};
  else
    options = options || {};
  var obj = {};
  do {
    Object.getOwnPropertyNames(object).forEach(function(name) {
      var prop = object[name];
      if (!hasOwn.call(obj, name) && (options.functions || typeof prop !== 'function')) {
        obj[name] = prop;
      }
    });
    if (options.all && object === Object.prototype) {
      break;
    }
  } while ((object = Object.getPrototypeOf(object)) && (options.all || object !== Object.prototype));
  return options.keys ? Object.keys(obj) : obj;
}

function lengthSort(a, b) {
  if (a.length < b.length) return -1;
  if (b.length < a.length) return 1;
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}
