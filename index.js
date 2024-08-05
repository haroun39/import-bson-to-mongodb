const fs = require('fs');
const path = require('path');
const BSON = require('bson');
const { exec } = require('child_process');
const{ main } = require('./import');
function BSON2JSON(from) {
    const buffer = fs.readFileSync(from);
    let index = 0;
    const documents = [];
    while (buffer.length > index) {
        index = BSON.deserializeStream(buffer, index, 1, documents, documents.length);
    }
    return documents;
}

function convertBSONToJSON(inputDir, outputDir) {
    // Ensure the output folder exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }


    fs.readdir(inputDir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Unable to scan folder:', err);
            return;
        }

        entries.forEach(entry => {
            const fullPath = path.join(inputDir, entry.name);
            const outputPath = path.join(outputDir, entry.name);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }
            fs.readdir(fullPath, (err, files) => {
                console.log(`-----------------------------------------------------------`);
                console.log(`\x1b[32m Converted ${entry.name} to ${path.basename(outputPath)} \x1b[0m`);
                console.log('-----------------------------------------------------------');
                files.filter(file => path.extname(file) === '.bson').forEach(file => {
                    const bsonFilePath = path.join(fullPath, file);
                    const bson2json = BSON2JSON(bsonFilePath);
                    const jsonFilePath = path.join(outputPath, path.basename(file, '.bson') + '.json');
                    fs.writeFileSync(jsonFilePath, JSON.stringify(bson2json, null, 2)); // Pretty-print JSON
                    console.log(`\x1b[34m Converted ${file} to ${path.basename(jsonFilePath)} \x1b[0m`);
                });
                console.log(`-----------------------------------------------------------`);
            });
        });
    });
}


const inputFolderPath = 'databases'; // Your input folder path with databases
const outputFolderPath = 'databases_for_mongo'; // Your output folder path

 convertBSONToJSON(inputFolderPath, outputFolderPath);

main().catch(console.error);