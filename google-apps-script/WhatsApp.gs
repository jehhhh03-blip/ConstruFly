/**
 * ConstruFly — aviso no WhatsApp a cada novo cadastro, usando o CallMeBot.
 *
 * Crie este arquivo no mesmo projeto do Apps Script (botão "+" ao lado de
 * "Arquivos" > Script > nome "WhatsApp") e veja o passo a passo em FORMULARIO.md.
 */

// Seu número com código do país e DDD, só números. Ex.: '5511987654321'
const WHATSAPP_NUMERO = '';

// Chave (apikey) que o CallMeBot envia para você no WhatsApp.
const WHATSAPP_APIKEY = '';

function avisarWhatsApp(dados) {
  if (!WHATSAPP_NUMERO || !WHATSAPP_APIKEY) return;
  try {
    const digitos = String(dados.whatsapp || '').replace(/\D/g, '');
    const linkContato = digitos ? 'https://wa.me/55' + digitos : '';

    const texto =
      '🔔 *Novo cadastro ConstruFly – 2º ciclo*\n\n' +
      '*Nome:* ' + (dados.nome || '-') + '\n' +
      '*Empresa:* ' + (dados.empresa || '-') + '\n' +
      '*WhatsApp:* ' + (dados.whatsapp || '-') + '\n' +
      '*E-mail:* ' + (dados.email || '-') + '\n' +
      '*Segmento:* ' + (dados.segmento || '-') + '\n' +
      '*Interesses:* ' + (dados.interesses || '-') + '\n' +
      (dados.mensagem ? '*Mensagem:* ' + String(dados.mensagem).slice(0, 500) + '\n' : '') +
      (linkContato ? '\nFalar com a pessoa: ' + linkContato : '');

    const url = 'https://api.callmebot.com/whatsapp.php' +
      '?phone=' + encodeURIComponent(WHATSAPP_NUMERO.replace(/\D/g, '')) +
      '&text=' + encodeURIComponent(texto) +
      '&apikey=' + encodeURIComponent(WHATSAPP_APIKEY);

    const r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    console.log('CallMeBot: ' + r.getResponseCode() + ' ' + r.getContentText().slice(0, 200));
  } catch (erro) {
    // Uma falha no aviso nunca impede o cadastro de ser gravado.
    console.error('Falha no aviso por WhatsApp: ' + erro);
  }
}

// Rode esta função uma vez pelo botão "Executar" para autorizar o envio
// e receber uma mensagem de teste no seu WhatsApp.
function testarWhatsApp() {
  if (!WHATSAPP_NUMERO || !WHATSAPP_APIKEY) {
    throw new Error('Preencha WHATSAPP_NUMERO e WHATSAPP_APIKEY antes de testar.');
  }
  avisarWhatsApp({
    nome: 'Teste de aviso',
    empresa: 'ConstruFly',
    whatsapp: '(11) 90000-0000',
    email: 'teste@construfly.com.br',
    segmento: 'Teste',
    interesses: 'Networking, Mentoria',
    mensagem: 'Se você recebeu esta mensagem, o aviso por WhatsApp está funcionando.'
  });
}
