/**
 * ConstruFly — recebe os cadastros da landing page e grava na planilha.
 *
 * Como usar: veja o passo a passo em FORMULARIO.md, na raiz do repositório.
 * Este script deve ser criado DENTRO da planilha (Extensões > Apps Script).
 */

// Nome da aba onde os cadastros serão gravados (é criada automaticamente).
const NOME_DA_ABA = 'Cadastros';

// Opcional: e-mail(s) que recebem um aviso a cada novo cadastro.
// Ex.: 'contato@construfly.com.br' ou 'a@x.com, b@y.com'. Deixe '' para não enviar.
const EMAIL_AVISO = '';

const CABECALHO = [
  'Data/hora', 'Nome', 'WhatsApp', 'E-mail', 'Empresa', 'Segmento',
  'Interesses', 'Mensagem', 'Aceite LGPD', 'Origem'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const dados = JSON.parse(e.postData.contents);

    // Campo anti-spam: pessoas não veem este campo, robôs costumam preenchê-lo.
    if (dados.site) return resposta({ ok: true });

    if (!dados.nome || !dados.whatsapp || !dados.email || !dados.empresa) {
      return resposta({ ok: false, error: 'Campos obrigatórios ausentes' });
    }

    const aba = obterAba();
    aba.appendRow([
      new Date(),
      limpar(dados.nome),
      limpar(dados.whatsapp),
      limpar(dados.email),
      limpar(dados.empresa),
      limpar(dados.segmento),
      limpar(dados.interesses),
      limpar(dados.mensagem),
      dados.consent ? 'Sim' : 'Não',
      limpar(dados.origem)
    ]);

    // Aviso no WhatsApp (arquivo WhatsApp.gs). Não faz nada se não estiver configurado.
    if (typeof avisarWhatsApp === 'function') avisarWhatsApp(dados);

    if (EMAIL_AVISO) {
      MailApp.sendEmail({
        to: EMAIL_AVISO,
        subject: 'Novo cadastro ConstruFly: ' + limpar(dados.nome),
        body:
          'Novo cadastro na lista de interesse do 2º ciclo.\n\n' +
          'Nome: ' + dados.nome + '\n' +
          'WhatsApp: ' + dados.whatsapp + '\n' +
          'E-mail: ' + dados.email + '\n' +
          'Empresa: ' + dados.empresa + '\n' +
          'Segmento: ' + (dados.segmento || '-') + '\n' +
          'Interesses: ' + (dados.interesses || '-') + '\n' +
          'Mensagem: ' + (dados.mensagem || '-') + '\n\n' +
          'Planilha: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }

    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, error: String(erro) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar no navegador se o App da Web está no ar.
function doGet() {
  return resposta({ ok: true, status: 'online' });
}

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_DA_ABA);
  if (!aba) aba = planilha.insertSheet(NOME_DA_ABA);
  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, CABECALHO.length)
      .setFontWeight('bold').setBackground('#012e71').setFontColor('#ffffff');
  }
  return aba;
}

// Limita o tamanho e impede que o texto seja interpretado como fórmula.
function limpar(valor) {
  const texto = String(valor || '').trim().slice(0, 2000);
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function resposta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
