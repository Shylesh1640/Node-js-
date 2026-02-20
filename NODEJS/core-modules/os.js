const os = require("os");

console.log("Operating System:", os.platform());
console.log("CPU Architecture:", os.arch());
console.log("CPU Cores:", os.cpus().length);
console.log("Total Memory:", Math.round(os.totalmem()/(1024*1024*1024)), "GB");
console.log("Free Memory:", Math.round(os.freemem()/(1024*1024*1024)), "GB");
console.log("Home Directory:", os.homedir());
console.log("Temporary Directory:", os.tmpdir());
console.log("Uptime (seconds):", os.uptime());