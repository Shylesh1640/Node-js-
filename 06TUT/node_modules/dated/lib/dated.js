var Graph = require('./graph');
var Scanner = require('./scanner');

var utils = require('./utils');

// timestamp, date
var reserved = 'do,if,in,for,int,let,new,try,var,byte,case,char,else,enum,goto,long,this,void,with,break,catch,class,const,final,float,short,super,throw,while,yield,delete,double,export,import,native,public,return,static,switch,throws,typeof,boolean,default,extends,finally,package,private,abstract,continue,debugger,function,volatile,interface,protected,transient,implements,instanceof,synchronized'.split(',');

reserved.push('date', 'timestamp');
reserved.push('null', 'true', 'false');
reserved.push('arguments');

var globals = utils.properties(global, {all: true, keys: true, functions: true});
reserved.push.apply(reserved, globals);

reserved.sort(utils.lengthSort);

function allocate(obj) {
  var i = 0;
  return function next(name) {
    do {
      var id = i++;
      var symbol = '';
      do {
        var rem = id % 26;
        id = ((id / 26) | 0) - 1;
        symbol = String.fromCharCode(97 + rem) + symbol;
      } while (id >= 0);
    } while (~reserved.indexOf(symbol));
    obj[name] = symbol;
    return symbol;
  };
}

function isSymbol(token) {
  return token.name;
}

function symbols(tokens) {
  var s = [];
  for (var i = 0, n = tokens.length; i < n; i++) {
    if (tokens[i].name) {
      s.push(tokens[i].name);
    }
  }
  return s;
}

function Tree() {
  this._graph = new Graph();
}

Tree.prototype.add = function(name, format) {
  var tokens = null, to = [];
  if (typeof format === 'string') {
    tokens = this.parseTokens(format);
    to = symbols(tokens);
  } else {
    tokens = [{value: JSON.stringify(format)}];
  }

  this._graph.add(name, tokens).to(to);
};

var rOpen = /\{\{/, rClose = /\}\}/;

Tree.prototype.parseTokens = function(string) {
  var value, scanner = new Scanner(string), tokens = [];

  while (!scanner.eos()) {
    value = scanner.scanUntil(rOpen);

    if (value) {
      tokens.push({
        value: value
      });
    }

    if (!scanner.scan(rOpen)) {
      break;
    }

    value = scanner.scanUntil(rClose);

    if (!scanner.scan(rClose)) {
      throw new Error('unclosed tag at ' + scanner.pos);
    }

    tokens.push({
      name: value
    });
  }

  return tokens;
};

Tree.prototype.parseFormat = function(string) {
  var back = false, token = '', tokens = [];
  for (var i = 0, n = string.length; i < n; i++) {
    var chr = string[i]
    if (back) {
      token += chr;
      back = false;
    } else if (chr === '\\') {
      back = true;
    } else if (!this._graph.has(chr)) {
      token += chr;
    } else {
      if (token) {
        tokens.push({
          value: token
        });
        token = '';
      }
      tokens.push({
        name: chr
      });
    }
  }
  token && tokens.push({
    value: token
  });
  return tokens;
};

Tree.prototype.render = function(format) {
  var graph = this._graph, tokens = this.parseFormat(format);

  var fields = this._graph.optimize(symbols(tokens));

  var varMap = {};
  var variables = fields.sized.map(allocate(varMap));

  var initial = fields.order.map(function(name) {
    var expression = serializeFor(name);
    return varMap[name] + ' = ' + expression;
  });

  initial.unshift('date = timestamp === undefined ? new Date() : new Date(timestamp)');

  var main = tokens.map(function(token) {
    if (token.value) {
      return JSON.stringify(token.value);
    }
    if (fields.cache[token.name]) {
      return varMap[token.name];
    }
    return serializeFor(token.name);
  }).join(' + ');

  var body = 'var ' + initial.join(', ') + ';\nreturn "" + ' + main + ';';

  return new Function('timestamp', body);

  function serializeFor(name) {
    var tokens = graph.get(name);
    if (!tokens) {
      throw new Error(name + ' has not been defined');
    }
    return serialize(tokens);
  }

  function serialize(tokens) {
    return tokens.map(function(token) {
      if (token.value) {
        return token.value;
      }
      if (fields.cache[token.name]) {
        return varMap[token.name];
      }
      return serializeFor(token.name);
    }).join('');
  }
};

var tree = new Tree();

tree.add('time', 'date.getTime()');

tree.add('year', 'date.getFullYear()');
tree.add('month', 'date.getMonth()');
tree.add('date', 'date.getDate()');
tree.add('day', 'date.getDay()');
tree.add('hours', 'date.getHours()');
tree.add('minutes', 'date.getMinutes()');
tree.add('seconds', 'date.getSeconds()');
tree.add('ms', 'date.getMilliseconds()');

tree.add('utcyear', 'date.getUTCFullYear()');
tree.add('utcmonth', 'date.getUTCMonth()');
tree.add('utcdate', 'date.getUTCDate()');
tree.add('utcday', 'date.getUTCDay()');
tree.add('utchours', 'date.getUTCHours()');
tree.add('utcminutes', 'date.getUTCMinutes()');
tree.add('utcseconds', 'date.getUTCSeconds()');
tree.add('utcms', 'date.getUTCMilliseconds()');

tree.add('timezone', 'date.getTimezoneOffset()');

tree.add('abszone', 'Math.abs({{timezone}})');
tree.add('dirzone', '({{timezone}} > 0 ? "-" : "+")');
tree.add('hrzone', '("0" + (({{abszone}} / 60) | 0)).slice(-2)');
tree.add('minzone', '("0" + {{abszone}} % 60).slice(-2)');

tree.add('moddate', '{{date}} % 10');
tree.add('fixdate', '({{moddate}} <= 3 && (({{date}} / 10) | 0) === 1)');
tree.add('suffixoffset', '({{fixdate}} ? 0 : {{moddate}}) - 1');

tree.add('suffixes', ['st', 'nd', 'rd']);
tree.add('days', ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur']);
tree.add('months', ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']);

tree.add(':day', '{{days}}[{{day}}]');
tree.add(':suffix', '({{suffixes}}[{{suffixoffset}}] || "th")');
tree.add(':today', 'new Date({{year}}, {{month}}, {{date}})');
tree.add(':week', 'new Date({{year}}, {{month}}, {{date}} - {{N}} + 3)');
tree.add(':fourth', 'new Date({{:week}}.getFullYear(), 0, 4)');
tree.add('@week', '(1 + Math.round(({{:week}} - {{:fourth}}) / 6048e5))');
tree.add('@year', '({{year}} + ({{month}} === 11 && {{@week}} < 9 ? 1 : {{month}} === 0 && {{@week}} > 9 ? -1 : 0))');

tree.add('d', '("0" + {{date}}).slice(-2)');
tree.add('D', '{{:day}}.slice(0, 3)');
tree.add('j', '{{date}}');
tree.add('l', '{{:day}} + "day"');
tree.add('N', '({{day}} || 7)');
tree.add('S', '{{:suffix}}');
tree.add('w', '{{day}}');
tree.add('z', 'Math.round(({{:today}} - new Date({{year}}, 0, 1)) / 864e5)');

tree.add('W', '("0" + {{@week}}).slice(-2)');

tree.add('F', '{{months}}[{{month}}]');
tree.add('m', '("0" + {{n}}).slice(-2)');
tree.add('M', '{{F}}.slice(0, 3)');
tree.add('n', '{{month}} + 1');
tree.add('t', 'new Date({{year}}, {{n}}, 0).getDate()');

tree.add('L', '({{Y}} % 4 === 0 & {{Y}} % 100 !== 0 | {{Y}} % 400 === 0)');
tree.add('o', '{{@year}}');
tree.add('Y', '{{year}}');
tree.add('y', '("" + {{year}}).slice(-2)');

tree.add('a', '({{hours}} > 11 ? "pm" : "am")');
tree.add('A', '({{hours}} > 11 ? "PM" : "AM")');
tree.add('B', '("00" + ((({{utchours}} * 3600 + {{utcminutes}} * 60 + {{utcseconds}} + 3600) / 86.4) | 0) % 1e3).slice(-3)');
tree.add('g', '({{hours}} % 12 || 12)');
tree.add('G', '{{hours}}');
tree.add('h', '("0" + {{g}}).slice(-2)');
tree.add('H', '("0" + {{hours}}).slice(-2)');
tree.add('i', '("0" + {{minutes}}).slice(-2)');
tree.add('s', '("0" + {{seconds}}).slice(-2)');
tree.add('u', '("00" + {{ms}}).slice(-3)');

// tree.add('e');
tree.add('I', '((new Date({{year}}, 0) - Date.UTC({{year}}, 0)) === (new Date({{year}}, 6) - Date.UTC({{year}}, 6)) ? 0 : 1))');
tree.add('O', '{{dirzone}} + {{hrzone}} + {{minzone}}');
tree.add('P', '{{dirzone}} + {{hrzone}} + ":" + {{minzone}}');
tree.add('T', '"UTC"'); // TODO: fix this
tree.add('Z', '-{{timezone}} * 60'); // TODO: check this

tree.add('c', '{{Y}}-{{m}}-{{d}}T{{H}}:{{i}}:{{s}}{{P}}');
tree.add('r', '{{D}}, {{d}} {{M}} {{Y}} {{H}}:{{i}}:{{s}} {{O}}');
tree.add('U', '+date');

function date(format) {
  return tree.render(format);
}

module.exports = date;
