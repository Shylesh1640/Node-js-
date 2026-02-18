const fs = require("fs");

//writeFile

fs.writeFile("example.txt", "Hello, this is a sample file.", (err) => {
    if (err) throw err;
    console.log("File created successfully")
});

console.log("File is processing")