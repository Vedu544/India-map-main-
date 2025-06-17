import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import GSDP from './gsdpModel.js';
import State from './stateModel.js';
import path from 'path';

dotenv.config();

const DB_NAME = "unico_project";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Database connected: ${connection.connection.host}`);
    if (process.env.LOAD_INITIAL_DATA === 'true') {
        console.log('Loading initial data...');
        loadInitialData()
    }  
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};

export default connectDB;

const loadInitialData = async () => {
    const filePath = path.join('C:', 'Users', 'SHUBHAM SHIVEKAR', 'Downloads', 'Sahil Downloads', 'GSDP_Current_2011-12_State_wise.csv');

    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        for (const row of rows) {
          const stateName = row['State/Uts'];
          const stateCode = row['State_code'];

          for (const [key, value] of Object.entries(row)) {
            if (key !== 'State/Uts' && key !== 'State_code') {
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
                  console.log(`Inserted: ${stateName} - ${year} - ${gsdp}`);
                } catch (err) {
                  console.error(`Insert error for ${stateName} (${year}):`, err.message);
                }
              }
            }
          }
        }

        console.log('CSV file successfully processed!');
        await mongoose.connection.close();
      })
      .on('error', async (err) => {
        console.error('Error reading CSV:', err.message);
        await mongoose.connection.close();
      });
}

