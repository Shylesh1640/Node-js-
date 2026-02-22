const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Welcome to the home page!");
    } else if (req.url === "/about") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("This is the about page.");
    } else if (req.url === "/file") { 
        const readStream = fs.createReadStream("sample-1.mp4");
        res.writeHead(200, { "Content-Type": "video/mp4" });
        readStream.pipe(res);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Page not found.");
    }
});

server.listen(5000, () => {
    console.log("Server is running on port 5000 server listening http://localhost:5000");
});