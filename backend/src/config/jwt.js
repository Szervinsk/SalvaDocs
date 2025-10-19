import "dotenv/config"; // Garante que as variáveis de ambiente sejam carregadas aqui primeiro

// Este arquivo é a ÚNICA fonte da verdade para os segredos JWT.
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Verificação de segurança para produção
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error("ERRO: As variáveis JWT_SECRET e JWT_REFRESH_SECRET devem ser definidas no arquivo .env");
  if (process.env.NODE_ENV === 'production') {
    process.exit(1); // Em produção, o app não deve iniciar sem os segredos
  }
}