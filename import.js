const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
// Define the path to the folder containing the databases
const databasesPath = 'databases_for_mongo';  // Your input folder path with databases

// MongoDB URI
// const uri = 'mongodb+srv://<userName>:<password>@<Clusters>/?retryWrites=true&w=majority&appName=test';
const uri = process.env.MONGO_DB_URL;


const main = async () => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
      // Connect to MongoDB
      await client.connect();
      console.log('\x1b[42m Connected to MongoDB \x1b[0m');

      // Iterate through all subfolders in the databases folder
      const dbFolders = fs.readdirSync(databasesPath);
      for (const dbFolder of dbFolders) {
          const dbPath = path.join(databasesPath, dbFolder);
          if (fs.statSync(dbPath).isDirectory()) {  // Only process directories
              const db = client.db(dbFolder);  // Create a database with the name of the folder

              // Iterate through all JSON files in the database folder
              const files = fs.readdirSync(dbPath);
              for (const file of files) {
                  if (file.endsWith('.json')) {  // Only process JSON files
                      const collectionName = file.slice(0, -5);  // Remove the .json extension to get the collection name
                      const collection = db.collection(collectionName);

                      const filePath = path.join(dbPath, file);
                      const requests = [];

                      try {
                          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                          if (Array.isArray(data)) {
                              data.forEach((item) => {
                                  requests.push({ insertOne: { document: item } });
                              });
                          } else {
                              console.error(`Invalid JSON format in file: ${file}`);
                          }
                      } catch (err) {
                          // If JSON parsing fails, try reading the file line by line
                          const lines = fs.readFileSync(filePath, 'utf8').split('\n');
                          lines.forEach((line) => {
                              if (line.trim()) {
                                  try {
                                      const item = JSON.parse(line);
                                      requests.push({ insertOne: { document: item } });
                                  } catch (err) {
                                      console.error(`Failed to parse line in file ${file}: ${line}`);
                                  }
                              }
                          });
                      }

                      // Execute the bulk write operation
                      if (requests.length > 0) {
                          try {
                              const result = await collection.bulkWrite(requests);
                              console.log(`\x1b[34m Inserted ${result.insertedCount} documents into ${collectionName} collection in ${dbFolder} database. \x1b[0m`);
                          } catch (err) {
                              console.error(`\x1b[31m Failed to insert documents into ${collectionName} collection in ${dbFolder} database: ${err} \x1b[0m`);
                          }
                      } else {
                          console.log(`No valid JSON documents found to insert into ${collectionName} collection in ${dbFolder} database.`);
                      }
                  }
              }
          }
      }
  } finally {
      // Close the MongoDB connection
      await client.close();
      console.log('MongoDB connection closed');
  }
}

exports.main = main;