# Use uma imagem base do Node.js mais recente
FROM node:18

# Definição do diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código da aplicação para o diretório de trabalho
COPY . .

# Expor a porta que o app vai rodar
EXPOSE 3000

# Comando para rodar o aplicativo
CMD ["npm", "start"]