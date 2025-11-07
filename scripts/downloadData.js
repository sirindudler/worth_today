const fs = require('fs');
const path = require('path');
const https = require('https');

// FRED API URLs for CSV downloads
const CPI_URL = 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL';
const TBILL_URL = 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=TB3MS';

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${filename}...`);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const filePath = path.join(DATA_DIR, filename);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded ${filename}`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function csvToJson(csvFilePath, outputFilename) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Converting ${path.basename(csvFilePath)} to JSON...`);

      const csvData = fs.readFileSync(csvFilePath, 'utf-8');
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',');

      const jsonData = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const obj = {};

        headers.forEach((header, index) => {
          obj[header.trim()] = values[index] ? values[index].trim() : null;
        });

        jsonData.push(obj);
      }

      const outputPath = path.join(DATA_DIR, outputFilename);
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
      console.log(`✓ Converted to ${outputFilename}`);

      resolve(outputPath);
    } catch (err) {
      reject(err);
    }
  });
}

async function main() {
  try {
    console.log('=== Downloading Historical Economic Data from FRED ===\n');

    // Download CPI data
    const cpiCsvPath = await downloadFile(CPI_URL, 'cpi.csv');
    await csvToJson(cpiCsvPath, 'cpi.json');

    // Download Treasury Bill data
    const tbillCsvPath = await downloadFile(TBILL_URL, 'treasury-bills.csv');
    await csvToJson(tbillCsvPath, 'treasury-bills.json');

    console.log('\n✓ All data downloaded and converted successfully!');
    console.log(`\nData saved to: ${DATA_DIR}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
