# Imagem base
FROM node:18-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Expõe a porta (Vite geralmente usa 5173, Create React App usa 3000)
# Ajuste conforme seu package.json
EXPOSE 3000

# Inicia em modo de desenvolvimento (permite Hot Reload se configurado no Compose)
CMD ["npm", "start"]