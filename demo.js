const fs = require("fs");
const evaluateLogFile = require("./index");

function readFile() {
  const contents = fs.readFileSync("./demo_file.txt", "utf8");
  console.log(evaluateLogFile(contents));
}

readFile();
