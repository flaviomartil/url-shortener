const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dbURI: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Tenant', tenantSchema);
