// node runs on a server - not in a browser(backend not frontend)
// the console is the terminal window
console.log("Hello World");
// global objects instead of window object
//console.log(global);
//has common core modules that we will explore
const os = require('os');
const path = require('path');
const math = require('./math');
//common js modules instead of ES6 modules 


console.log(math.add(2,6));

// .

// 
// console.log(os.type());
// console.log(os.version());
// console.log(os.homedir());

// console.log(__dirname);
// console.log(__filename);

// console.log(path.dirname(__filename));
// console.log(path.basename(__filename));
// console.log(path.extname(__filename));

// console.log(path.parse(__filename));

//node package manager - npm
