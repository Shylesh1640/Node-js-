dated
=====

Documentation. Meh.

Examples
========

Takes a string, returns a function that accepts anything the `Date` constructor takes.

```js
var dated = require('dated');

// php-esque date format string
var date = dated('D M d Y H:i:s \\G\\M\\TO');

date(Date.now()); // equivalent to date();
// => 'Tue May 06 2014 21:42:23 GMT-0700'

date(1399000000000);
// => 'Thu May 01 2014 20:06:40 GMT-0700'
```

License
=======

> The MIT License (MIT)

> Copyright &copy; 2014 Eli Skeggs &lt;skeggse@gmail.com&gt;

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
