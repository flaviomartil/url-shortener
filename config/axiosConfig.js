const axios = require('axios');
// CommonJS
const axiosRetry = require('axios-retry').default;

// Configurações padrão do axios
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// Configurar retries para requisições falhadas
axiosRetry(axiosInstance, {
  retries: 3,  // Número de retries
  retryDelay: (retryCount) => {
    console.log(`Tentativa de retry: ${retryCount}`);
    return retryCount * 2000;  // Delay de 2 segundos entre retries
  },
  retryCondition: (error) => {
    // Retry em requisições que falharem devido a erros de rede ou 5xx
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  }
});

module.exports = axiosInstance;