import { google } from 'googleapis';

/**
 * Notifica o Google Indexing API sobre uma URL atualizada.
 * Esta função é silenciosa e não quebra o fluxo da aplicação caso falhe.
 * 
 * @param url - A URL completa que deve ser indexada pelo Google
 */
export async function notifyGoogleIndexing(url: string): Promise<void> {
  try {
    // Valida se as variáveis de ambiente necessárias estão configuradas
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.error(
        '[Google Indexing] Credenciais não configuradas. Defina GOOGLE_CLIENT_EMAIL e GOOGLE_PRIVATE_KEY no .env'
      );
      return;
    }

    // Trata os caracteres \n da private key
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    // Configura a autenticação JWT
    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: formattedPrivateKey,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // Autentica
    await jwtClient.authorize();

    // Inicializa o cliente da Indexing API
    const indexing = google.indexing('v3');

    // Envia a notificação de URL atualizada
    const response = await indexing.urlNotifications.publish({
      auth: jwtClient,
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });

    console.log(
      `[Google Indexing] URL notificada com sucesso: ${url}`,
      response.data
    );
  } catch (error) {
    // Loga o erro mas não interrompe o fluxo da aplicação
    console.error(
      '[Google Indexing] Erro ao notificar Google sobre a URL:',
      url,
      error
    );
  }
}
