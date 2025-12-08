# Troque alpine por slim (baseado em Debian) para compatibilidade com Python/OpenCV/Lxml
FROM node:18-slim

# Define variáveis de ambiente para evitar interações durante a instalação
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala Python, Chromium e DEPENDÊNCIAS DE SISTEMA que suas libs precisam
# libgl1 e libglib2.0-0 são obrigatórios para opencv
# gcc, g++ e python3-dev ajudam a compilar o que faltar
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    chromium \
    chromium-driver \
    libgl1 \
    libglib2.0-0 \
    gcc \
    g++ \
    make \
    libxml2-dev \
    libxslt-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia e instala dependências Node
COPY package*.json ./
RUN npm install

# Copia dependências Python
COPY bots/requirements.txt ./bots/

# ATENÇÃO: Se falhar aqui, veja a dica sobre "requirements.txt" abaixo do código
RUN pip3 install --no-cache-dir -r bots/requirements.txt --break-system-packages

# Copia o resto do código
COPY . .

# Expõe a porta
EXPOSE 5000

# Variáveis de ambiente para o Chrome no Linux
ENV CHROME_BIN=/usr/bin/chromium \
    CHROME_PATH=/usr/lib/chromium/

CMD ["npm", "start"]