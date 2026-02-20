const fs = require("fs");

//writeFile

fs.writeFile("help.txt", "Hello, this is a sample file.", (err) => {
    if (err) throw err;
    console.log("File created successfully")
    fs.readFile("help.txt", {encoding:"utf-8"}, (err, data) => {
        if (err) throw err;
        console.log("File read successfully", data);
    })
});

console.log("File is processing")