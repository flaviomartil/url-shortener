const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async (tenantId) => {
  const dbURI = process.env.DB_URI.replace('<TENANT_ID>', tenantId);
  const db = mongoose.createConnection(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db.on('connected', () => {
    console.log(`Mongoose connected to tenant ${tenantId}`);
  });

  db.on('error', (err) => {
    console.error(`Connection error for tenant ${tenantId}: ${err}`);
  });

  return db;
};

module.exports = { connectDB };
