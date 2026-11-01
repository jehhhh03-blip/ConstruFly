# Contador de visitas (Google Analytics 4)

A página já está preparada para o Google Analytics 4. Falta só o **ID de medição** (começa com `G-`).

## 1. Criar a conta e a propriedade
1. Acesse [analytics.google.com](https://analytics.google.com) com a conta Google da ConstruFly.
2. Toque em **Começar a medir** (ou **Administrador > Criar > Conta**).
3. **Nome da conta:** ConstruFly. Avance.
4. **Nome da propriedade:** Landing page 2º ciclo · **Fuso horário:** Brasil (Horário de Brasília) · **Moeda:** Real (BRL). Avance.
5. Preencha os dados da empresa e os objetivos (pode marcar "Gerar leads") e aceite os termos.

## 2. Criar o fluxo de dados da web
1. Escolha a plataforma **Web**.
2. **URL do site:** `jehhhh03-blip.github.io/ConstruFly` · **Nome do fluxo:** Landing page.
3. Toque em **Criar fluxo**.
4. Copie o **ID de medição**, no formato `G-XXXXXXXXXX`.

## 3. Colocar o ID na página
No `index.html`, a linha `window.GA_ID = "G-3V0WTTDCFJ";` já está configurada (conta ConstruFly > Landing page 2º ciclo).

## O que é medido
- **Visitas e visitantes** (relatórios padrão do GA4).
- **cta_click:** cliques nos botões que levam ao formulário.
- **generate_lead:** cadastro enviado com sucesso. Para vê-lo como conversão, vá em
  **Administrador > Eventos-chave** e marque `generate_lead` como evento-chave
  (ele aparece na lista depois do primeiro cadastro).

## Privacidade (LGPD)
- O visitante vê um aviso de cookies e escolhe **Aceitar** ou **Recusar**. A escolha pode ser mudada no link **Cookies** do rodapé.
- Antes do aceite, o Analytics roda em modo sem cookies (Consent Mode), então ainda há uma contagem aproximada.
- Nenhum dado do formulário (nome, e-mail, telefone) é enviado ao Analytics.
