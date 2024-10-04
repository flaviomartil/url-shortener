const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sentry = require('@sentry/node');
const client = require('prom-client');
const routes = require('./routes/userRoutes');
const axiosInstance = require('./config/axiosConfig');
const winston = require('winston');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

// Configuração de logs com Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'url-shortener' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Configuração de métricas com Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Conectar ao banco de dados principal para gerenciamento de tenants
mongoose.connect(process.env.MAIN_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao banco de dados principal');
}).catch((err) => {
  logger.error('Erro ao conectar ao banco de dados principal', err);
  Sentry.captureException(err);
});

const app = express();

app.use(express.json());

// Middleware para uso do Sentry
app.use(Sentry.Handlers.requestHandler());

// Middleware de rotas de usuários (com suporte multi-tenant)
app.use('/users', routes);

// Middleware para capturar erros e enviar ao Sentry
app.use(Sentry.Handlers.errorHandler());

// Middleware customizado para capturar erros e enviar ao Sentry e logar com Winston
app.use((err, req, res, next) => {
  logger.error('Erro interno do servidor', err);
  Sentry.captureException(err);
  res.status(500).send('Erro interno do servidor');
});

// Rota para monitoramento de métricas do Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Exemplo de integração com API externa usando Axios com retries
app.get('/api-external', async (req, res) => {
  try {
    const response = await axiosInstance.get('/path');
    res.send(response.data);
  } catch (error) {
    logger.error('Erro na requisição para API externa', error);
    Sentry.captureException(error);
    res.status(500).send('Erro ao acessar a API externa');
  }
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  console.log(`Servidor rodando na porta ${PORT}`);
});