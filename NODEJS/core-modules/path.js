const path = require("path");

const filepath = "C:/Users/Shylesh/OneDrive/Desktop/Node-js-/NODEJS/intro/app.js";

console.log("Basename:", path.basename(filepath));
console.log("Dirname:", path.dirname(filepath));
console.log("Extension:", path.extname(filepath));

//text.txt

console.log("Parsed path:", path.parse(filepath));
console.log(__dirname)
console.log('joined path:', path.join(__dirname, "text.txt"))

console.log("joined path",path.join(__dirname))