// generate-letter.ts
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

interface LetterData {
  company: string;
  position: string;
  content: string;
}

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(query);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

function processHTMLTemplate(templateContent: string, data: LetterData): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return templateContent
    .replace(/{{DATE}}/g, currentDate)
    .replace(/{{JOB_POSITION}}/g, data.position)
    .replace(/{{JOB_COMPANY}}/g, data.company)
    .replace(/{{LETTER_CONTENT}}/g, data.content);
}

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    let company = '';
    let position = '';
    
    // Parse command line arguments
    args.forEach((arg) => {
      if (arg.startsWith('--company=')) company = arg.replace('--company=', '');
      if (arg.startsWith('--position=')) position = arg.replace('--position=', '');
    });

    // Prompt for missing information
    if (!company) {
      company = await askQuestion('Enter the company name: ');
    }
    if (!position) {
      position = await askQuestion('Enter the job position: ');
    }

    // Read the presentation letter template
    const letterTemplatePath = path.resolve(__dirname, 'presentation-letter.txt');
    let letterContent: string;
    
    try {
      letterContent = fs.readFileSync(letterTemplatePath, 'utf8');
    } catch (error) {
      console.error('Error reading presentation-letter.txt:', error);
      process.exit(1);
    }

    // Read the HTML template
    const htmlTemplatePath = path.resolve(__dirname, 'presentation.html');
    let htmlTemplate: string;
    
    try {
      htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    } catch (error) {
      console.error('Error reading presentation.html:', error);
      process.exit(1);
    }

    // Replace placeholders in letter content
    const processedContent = letterContent
      .replace(/\[job-company\]/g, company)
      .replace(/\[job-position\]/g, position);

    const letterData: LetterData = {
      company,
      position,
      content: processedContent
    };

    // Process HTML template with letter data
    const htmlContent = processHTMLTemplate(htmlTemplate, letterData);
    
    // Save processed HTML file
    const htmlPath = path.resolve(__dirname, 'letter.html');
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('HTML letter generated: letter.html');

    // Generate PDF
    console.log('Generating PDF...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfPath = path.resolve(__dirname, 'reference-letter.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    
    console.log(`✅ Reference letter generated successfully!`);
    console.log(`📄 HTML: ${htmlPath}`);
    console.log(`📄 PDF: ${pdfPath}`);
    console.log(`👔 Position: ${position}`);
    console.log(`🏢 Company: ${company}`);
    
    process.stdin.pause();
    
  } catch (error) {
    console.error('Error generating letter:', error);
    process.exit(1);
  }
}

main();