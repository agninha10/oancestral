import { google } from 'googleapis';

/**
 * Notifica o Google Indexing API sobre uma URL atualizada.
 * Esta função é silenciosa e não quebra o fluxo da aplicação caso falhe.
 * 
 * @param url - A URL completa que deve ser indexada pelo Google
 */
export async function notifyGoogleIndexing(url: string): Promise<void> {
  await notifyGoogleIndex(url);
}

export async function notifyGoogleIndex(url: string): Promise<unknown | void> {
  console.log(`[Google Indexing] ⏳ Iniciando notificação para: ${url}`);

  try {
    // Valida se as variáveis de ambiente necessárias estão configuradas
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY_BASE64) {
      console.error(
        '[Google Indexing] Credenciais não configuradas. Defina GOOGLE_CLIENT_EMAIL e GOOGLE_PRIVATE_KEY_BASE64 no .env'
      );
      return;
    }

    // Pega a chave em Base64 da Vercel e decodifica de volta para UTF-8 (que já contém os \n originais)
    const base64Key = process.env.GOOGLE_PRIVATE_KEY_BASE64;
    const privateKey = base64Key 
      ? Buffer.from(base64Key, 'base64').toString('utf-8') 
      : undefined;

    // Configura a autenticação JWT
    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // Autentica
    await jwtClient.authorize();

    const response = await jwtClient.request({
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      data: {
        url,
        type: 'URL_UPDATED',
      },
    });

    console.log(`[Google Indexing] ✅ Sucesso! Status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    // Loga o erro mas não interrompe o fluxo da aplicação
    console.error(`[Google Indexing] ❌ Erro:`, error?.message || error);
  }
}
