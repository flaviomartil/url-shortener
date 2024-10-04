const Tenant = require('../models/tenantModel');
const { connectDB } = require('../config/dbConfig');

const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];

  if (!tenantId) {
    return res.status(400).send('Tenant ID não fornecido');
  }

  try {
    // Find tenant information
    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).send('Tenant não encontrado');
    }

    // Connect to tenant-specific database
    req.db = await connectDB(tenant.dbURI);

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
};

module.exports = tenantMiddleware;
