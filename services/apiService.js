   const axiosInstance = require('../config/axiosConfig');
   const circuitBreakerConfig = require('../config/circuitBreakerConfig');

   // Função para obter dados da API com axios
   const fetchDataFromApi = async () => {
       try {
           const response = await axiosInstance.get('/data');
           return response.data;
       } catch (error) {
           throw new Error('Erro ao buscar dados da API');
       }
   };

   // Instanciar Circuit Breaker com a função de ação
   const breaker = circuitBreakerConfig(fetchDataFromApi);

   // Função para obter os dados utilizando o Circuit Breaker
   const getData = async () => {
       try {
           return await breaker.fire();
       } catch (error) {
           console.error('Erro no Circuit Breaker:', error);
           return 'Fallback: API indisponível no momento';
       }
   };

   module.exports = {
       getData
   };
