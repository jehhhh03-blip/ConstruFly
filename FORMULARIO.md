# Ligar o formulário à planilha do Google

Os cadastros da landing page são gravados numa planilha do Google, uma linha por pessoa.
A configuração leva cerca de 5 minutos e é feita uma única vez.

## 1. Criar a planilha

1. Acesse [sheets.new](https://sheets.new) com a conta Google da ConstruFly.
2. Dê um nome, por exemplo **ConstruFly – Lista de interesse 2º ciclo**.

## 2. Colar o script

1. Na planilha, clique em **Extensões > Apps Script**.
2. Apague o código de exemplo que aparece.
3. Copie todo o conteúdo do arquivo [`google-apps-script/Codigo.gs`](google-apps-script/Codigo.gs) e cole no editor.
4. (Opcional) Para receber um e-mail a cada novo cadastro, preencha `EMAIL_AVISO` no início do código.
5. Clique no ícone de disquete (**Salvar**).

## 3. Publicar como App da Web

1. Clique em **Implantar > Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - **Descrição:** Formulário landing page
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** **Qualquer pessoa**
4. Clique em **Implantar** e depois em **Autorizar acesso**.
   - Escolha sua conta. Se aparecer "O Google não verificou este app", clique em
     **Avançado > Acessar (não seguro)**. O aviso aparece porque o script é seu e não
     passou por verificação do Google. Ele só tem acesso a esta planilha e ao envio de e-mail.
5. Copie a **URL do App da Web**. Ela termina em `/exec`.

Para conferir, abra essa URL no navegador. Deve aparecer `{"ok":true,"status":"online"}`.

## 4. Colocar a URL na página

No arquivo `index.html`, procure a linha:

```js
const FORM_ENDPOINT = "";
```

e cole a URL entre as aspas:

```js
const FORM_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Na primeira vez que alguém enviar o formulário, a aba **Cadastros** é criada na planilha com o cabeçalho:

| Data/hora | Nome | WhatsApp | E-mail | Empresa | Segmento | Interesses | Mensagem | Aceite LGPD | Origem |
|---|---|---|---|---|---|---|---|---|---|

## Se alterar o script depois

Depois de editar o código, vá em **Implantar > Gerenciar implantações**, clique no lápis,
escolha **Nova versão** e clique em **Implantar**. Assim a URL continua a mesma.

## Cuidados com os dados (LGPD)

- Compartilhe a planilha só com quem precisa ver os contatos.
- Use os dados apenas para falar sobre a ConstruFly, como informado no formulário.
- Se alguém pedir para sair da lista, apague a linha da pessoa.

## Aviso por e-mail a cada cadastro (ativo)

Preencha `EMAIL_AVISO` no `Código.gs` e publique uma nova versão (veja "Se alterar o script depois").
No celular, ative as notificações do app Gmail para ser avisado na hora.

## Aviso no WhatsApp a cada cadastro (opcional, ainda não ativado)

> Em novembro de 2026 o CallMeBot não estava aceitando novos usuários ("bot cheio").
> O código já está pronto: basta seguir os passos abaixo quando houver vagas.

O aviso usa o [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/), serviço gratuito
para uso pessoal que manda mensagens para o **seu próprio número**.

### 1. Pegar a chave (apikey)
1. No site do CallMeBot, veja o número atual do robô e salve-o nos contatos do celular.
2. Mande para esse contato, pelo WhatsApp, a mensagem: `I allow callmebot to send me messages`
3. Em até 2 minutos chega a resposta "API Activated for your phone number", com a sua **apikey**.
   Se não chegar, tente de novo após 24 horas.

### 2. Adicionar o arquivo no Apps Script
1. No editor do Apps Script, toque no **+** ao lado de "Arquivos" > **Script** e dê o nome `WhatsApp`.
2. Apague o conteúdo de exemplo e cole o conteúdo de [`google-apps-script/WhatsApp.gs`](google-apps-script/WhatsApp.gs).
3. Preencha `WHATSAPP_NUMERO` (ex.: `'5511987654321'`) e `WHATSAPP_APIKEY`.
4. No arquivo `Código.gs`, logo depois da linha `]);` que fecha o `aba.appendRow([...`, adicione:
   ```js
   if (typeof avisarWhatsApp === 'function') avisarWhatsApp(dados);
   ```
5. Salve.

### 3. Autorizar e testar
1. No seletor de funções ao lado de "Executar", escolha **testarWhatsApp** e toque em **Executar**.
2. Autorize de novo (o script agora acessa um serviço externo). Você deve receber uma mensagem de teste.

### 4. Publicar a nova versão
**Implantar > Gerenciar implantações** > lápis > Versão: **Nova versão** > **Implantar**. A URL continua a mesma.

Observações: o aviso passa os dados do cadastro pelo CallMeBot, um serviço de terceiros.
Se o CallMeBot falhar, o cadastro continua sendo gravado na planilha normalmente.
