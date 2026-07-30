const os = require('os');

console.log("=== Server Info ===");
console.log("Platform:", os.platform());
console.log("Total Memory (GB):", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
console.log("CPU Cores:", os.cpus().length);

function greet(name) {
  return `Hello, ${name}! This is running on Node.js, not a browser.`;
}

console.log(greet("Jobayer"));
