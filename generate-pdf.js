const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs").promises;
const path = require("path");

(async () => {
  let serverProcess;
  try {
    // Start HTTP server
    console.log("Starting HTTP server...");
    serverProcess = spawn("http-server", [".", "-p", "8081"], {
      cwd: __dirname,
      stdio: "pipe",
    });

    // Log server errors
    serverProcess.stderr.on("data", (data) => {
      console.error("Server error:", data.toString());
    });

    // Wait for server to be ready (poll instead of fixed delay)
    console.log("Waiting for HTTP server to be ready...");
    await new Promise((resolve, reject) => {
      const maxAttempts = 20;
      let attempts = 0;

      const check = () => {
        http
          .get("http://127.0.0.1:8081", () => {
            resolve();
          })
          .on("error", () => {
            attempts++;
            if (attempts >= maxAttempts) {
              reject(new Error("HTTP server did not start in time"));
            } else {
              setTimeout(check, 300);
            }
          });
      };

      check();
    });
    console.log("HTTP server started on port 8081");

    // Launch Puppeteer
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("Browser launched successfully");

    // Load the HTML file from the local HTTP server
    const url = "http://127.0.0.1:8081/index.html";
    console.log(`Loading URL: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 5000 });
    console.log("Page loaded successfully");

    // Define the path for output PDF
    const pdfFilePath = "cv.pdf";

    // Generate the PDF
    console.log("Generating PDF...");
    await page.pdf({
      path: pdfFilePath,
      format: "A3",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
      },
    });
    console.log(`PDF generated successfully at: ${pdfFilePath}`);

    // Close the browser
    await browser.close();

    // Stop the HTTP server
    if (serverProcess) {
      console.log("Stopping HTTP server...");
      serverProcess.kill();
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (serverProcess) {
      serverProcess.kill();
    }
  }
})();
