# URL Shortener API

## Descrição
API para encurtamento de URLs com autenticação de usuários e contabilização de cliques.

## Tecnologias Utilizadas
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Docker
- Kubernetes

## Como Rodar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Passos

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu_usuario/url-shortener.git
    cd url-shortener
    ```

2. Configure as variáveis de ambiente no arquivo `.env`:
    ```plaintext
    DATABASE_URL=sua_string_de_conexao_mongo
    SECRET_KEY=sua_chave_secreta
    ```

3. Execute o projeto utilizando Docker Compose:
    ```bash
    docker-compose up
    ```

4. A API estará disponível em `http://localhost:3000`

### Kubernetes

1. Crie um segredo no Kubernetes para armazenar as variáveis de ambiente:
    ```bash
    kubectl create secret generic database-url-secret --from-literal=url='mongodb://meuUsuario:minhaSenha@mongo:27017/url_shortener'
    ```

2. Aplique as configurações do Kubernetes:
    ```bash
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    ```

3. Verifique os recursos no Kubernetes:
    ```bash
    kubectl get pods
    kubectl get services
    kubectl describe deployment app-deployment
    kubectl describe service app-service
    ```

## Endpoints

### Autenticação
- `POST /api/auth/register`: Registrar usuário
- `POST /api/auth/login`: Login de usuário e retorno de token

### URL
- `POST /api/urls/shorten`: Encurtar URL (requisição autenticada e não autenticada)
- `GET /api/urls/user-urls`: Listar URLs do usuário (requisição autenticada)
- `GET /:shortUrl`: Redirecionar para URL original e contabilizar clique
- `DELETE /api/urls/delete/:id`: Deletar URL do usuário (requisição autenticada)
- `PUT /api/urls/update/:id`: Atualizar URL do usuário (requisição autenticada)

## Contato
Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para abrir uma issue ou entrar em contato.

**Autor:** Flávio Wormstall Martil
**Email:** flaviomartil5@gmail.com
**GitHub:** [flaviomartil](https://github.com/flaviomartil)