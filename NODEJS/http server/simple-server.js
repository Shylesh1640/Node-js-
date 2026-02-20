const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from Node.js server!");
});

server.listen(5000, () => {
    console.log("Server is running on port 5000 server listening http://localhost:5000");
});