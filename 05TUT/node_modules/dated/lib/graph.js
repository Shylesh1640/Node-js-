function Node(graph, name, data) {
  if (name === '__proto__') {
    throw new Error('name cannot be __proto__');
  }
  this.name = name;
  this.data = data;

  this._graph = graph;

  this._to = Object.create(null);
  this._from = Object.create(null);
}

Node.prototype.to = function(name) {
  if (Array.isArray(name)) {
    for (var i = 0, n = name.length; i < n; i++) {
      this.to(name[i]);
    }
  } else {
    var nodes = this._graph._nodes, node = nodes[name];
    if (!node) {
      node = nodes[name] = new Node(this._graph, name, undefined);
    }
    this._to[name] = node;
    node._from[this.name] = this;
  }
};

Node.prototype.from = function(name) {
  if (Array.isArray(name)) {
    for (var i = 0, n = name.length; i < n; i++) {
      this.from(name[i]);
    }
  } else {
    var nodes = this._graph._nodes, node = nodes[name];
    if (!node) {
      node = nodes[name] = new Node(this._graph, name, undefined);
    }
    this._from[name] = node;
    node._to[this.name] = this;
  }
};

// parents -> to
// children -> from
function Graph() {
  this._nodes = Object.create(null);
}

Graph.prototype.add = function(name, data) {
  if (this._nodes[name]) {
    this._nodes[name].data = data;
  } else {
    this._nodes[name] = new Node(this, name, data);
  }
  return this._nodes[name];
};

Graph.prototype.has = function(name) {
  return !!this._nodes[name];
};

Graph.prototype.get = function(name) {
  return this._nodes[name].data;
};

/**
 * For a given set of nodes, find all the nodes they point to recursively, and
 * special-case the onces that are referenced from multiple sources in the
 * sub-graph. The special-cased nodes are ordered by reference.
 */
Graph.prototype.optimize = function(names) {
  var nodes = this._nodes, found = {}, count = {}, visited = {};

  names.forEach(deep);

  // clear set of visited nodes
  visited = {};

  // create cache object and order array
  var cache = {}, order = [];

  // visit each unvisited node
  for (var name in found) {
    visit(name);
  }

  var sized = Object.keys(cache).sort(function(a, b) {
    return count[b] - count[a];
  });

  return {
    cache: cache,
    order: order,
    sized: sized
  };

  function incr(name) {
    if (count[name]) {
      count[name]++;
    } else {
      count[name] = 1;
    }
  }

  function deep(name, prev) {
    var names = nodes[name]._to;
    for (var next in names) {
      deep(next, name);
    }
    found[name] = true;
    if (prev === undefined) {
      incr(name);
    } else if (!visited[name] || !visited[name][prev]) {
      incr(name);
      if (!visited[name]) {
        visited[name] = {};
      }
      visited[name][prev] = true;
    }
  }

  function visit(name) {
    if (visited[name] === 1) {
      throw new Error('cyclic graph');
    }
    if (!visited[name]) {
      visited[name] = 1;
      var from = nodes[name]._from;
      for (var next in from) {
        visit(next);
      }
      visited[name] = 2;
      delete found[name];
      if (count[name] > 1) {
        cache[name] = true;
        order.unshift(name);
      }
    }
  }
};

module.exports = Graph;
