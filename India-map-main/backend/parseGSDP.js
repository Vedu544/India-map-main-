import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GSDP from './models/gsdpModel.js'; // Ensure this model exists
import State from './models/stateModel.js'; // Ensure this model exists
import path from 'path';
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));


  const filePath = path.join(__dirname, 'data', 'GSDP_Current_2011-12_State_wise.csv');

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row) => {
    // The first column is the state/UT name
    const stateName = row['State/Uts'];
    const stateCode = row['State_code'];
    
    // Handle special cases like "Jammu & Kashmir-U.T."
    const isSpecialCase = stateName.includes('Jammu & Kashmir');
    
    console.log('Processing:', stateName, '(', stateCode, ')');
    
    // Iterate over each column except the state column
    for (const [key, value] of Object.entries(row)) {
      if (key !== 'State/Uts' && key !== 'State_code') {
        // Extract the year from the column name (e.g., "GSDP-Curr-2011-12(Cr)" -> "2011-12")
        const yearMatch = key.match(/GSDP-Curr-(\d{4}-\d{2})/);
        if (yearMatch) {
          const year = yearMatch[1];
          const gsdp = Number(value) || 0;

          const record = {
            state_code: stateCode,
            year,
            gsdp,
          };

          const state = {
            state_name: stateName,
            state_code: stateCode,
          };

          try {
            await GSDP.create(record);
            await State.updateOne({ state_code: stateCode }, state, { upsert: true });
            console.log(`Inserted: ${stateName} (${stateCode || 'NoCode'}) - ${year} - ${gsdp}`);
          } catch (err) {
            console.error(`Insert error for ${stateName} (${year}):`, err.message);
          }
        }
      }
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed!');
    mongoose.connection.close();
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err.message);
    mongoose.connection.close();
  });