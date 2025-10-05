const fs = require("fs").promises;
const path = require("path");

(async () => {
  try {
    console.log("Starting HTML generation for GitHub Pages...");

    // Read the cv-merge.html template
    const templatePath = path.join(__dirname, "html", "cv-merge.html");
    let htmlTemplate = await fs.readFile(templatePath, "utf8");
    console.log("Template loaded successfully");

    // Read the job.json data
    const jobDataPath = path.join(__dirname, "job.json");
    const jobData = await fs.readFile(jobDataPath, "utf8");
    console.log("Job data loaded successfully");

    // Replace the fetch call with embedded JSON data
    // This makes the HTML standalone and suitable for GitHub Pages
    const standaloneHtml = htmlTemplate.replace(/fetch\('\.\.\/job\.json'\)/g, `Promise.resolve({ json: () => ${jobData} })`);

    // Update image paths to be relative from root (since index.html is at root)
    const htmlWithFixedPaths = standaloneHtml.replace(/src="\/images\//g, 'src="images/');

    // Write the standalone HTML file to root directory
    const outputPath = path.join(__dirname, "index.html");
    await fs.writeFile(outputPath, htmlWithFixedPaths);
    console.log(`✓ GitHub Pages HTML generated successfully at: ${outputPath}`);
    console.log("You can now commit and push index.html to your repository");
  } catch (error) {
    console.error("Error generating HTML:", error);
    process.exit(1);
  }
})();
