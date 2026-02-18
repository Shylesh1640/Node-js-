const fs = require("fs")
//writeFile

fs.writeFileSync("example.txt", "Hello, this is a sample file.");
console.log("File created successfully");

//readFile

const data = fs.readFileSync("example.txt", {encoding:"utf-8"});
console.log("File read successfully",data);