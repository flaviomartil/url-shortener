   const opossum = require('opossum');

   const options = {
       timeout: 3000, // 3 segundos de timeout
       errorThresholdPercentage: 50, // Ativa o circuito se 50% das requisições falharem
       resetTimeout: 30000 // Fecha o circuito após 30 segundos
   };

   const circuitBreaker = (action) => {
       return new opossum(action, options);
   };

   module.exports = circuitBreaker;
