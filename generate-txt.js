// generate-txt.js
// Usage: node generate-txt.js --file=template.txt --company="Company Name" --position="Job Title"
// Example: node generate-txt.js --file=presentation-letter.txt --company="Acme Corp" --position="Frontend Developer"

const fs = require("fs");
const path = require("path");

// Parse command line arguments
const args = process.argv.slice(2);

let templateFile = "";
let company = "";
let position = "";

args.forEach((arg) => {
  if (arg.startsWith("--file=")) templateFile = arg.replace("--file=", "");
  if (arg.startsWith("--company=")) company = arg.replace("--company=", "");
  if (arg.startsWith("--position=")) position = arg.replace("--position=", "");
});

function askQuestion(query) {
  return new Promise((resolve) => {
    process.stdout.write(query);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (data) => {
      resolve(data.trim());
    });
  });
}

async function main() {
  if (!templateFile) {
    console.error('Usage: node generate-txt.js --file=template.txt [--company="Company Name"] [--position="Job Title"]');
    process.exit(1);
  }
  if (!company) {
    company = await askQuestion("Enter the company name: ");
  }
  if (!position) {
    position = await askQuestion("Enter the job position: ");
  }

  const templatePath = path.resolve(__dirname, templateFile);

  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading template file:", err);
      process.exit(1);
    }
    let result = data.replace(/\[job-company\]/g, company).replace(/\[job-position\]/g, position);
    console.log("\n--- Generated Letter ---\n");
    console.log(result);
    console.log("\n-----------------------\n");
    process.exit(0);
  });
}

main();
