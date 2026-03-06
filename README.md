# 🛡️ Sistema de Gestão e Controle de Acesso - Bodylife

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success)
![Cypress Tests](https://img.shields.io/badge/Testes_E2E-Passando-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

Um sistema web completo para controle de acesso, monitoramento de CFTV e gestão de membros, desenvolvido com foco em performance, código limpo e testes automatizados. 

## 🎯 Objetivo do Projeto
Este projeto foi desenvolvido para modernizar a gestão de segurança (Instituto Security / Bodylife), integrando o controle físico (portões), monitoramento em tempo real (câmeras) e a administração de usuários em uma única interface no estilo SPA (Single Page Application).

## ✨ Principais Funcionalidades
- **🔐 Autenticação Segura:** Tela de login blindada com validação de credenciais e redirecionamento seguro.
- **📊 Dashboard Interativo:** Painel de controle com estatísticas em tempo real e acionamento remoto de portões.
- **📹 Monitoramento CFTV (Live):** Grid de câmeras rodando via WebSockets (JSMpeg) com suporte a tela cheia.
- **👥 Gestão de Equipe:** Interface para cadastro dinâmico de novos membros e visualização de usuários ativos.
- **📝 Sistema de Auditoria (Logs):** Registro automático de todas as ações importantes realizadas no sistema (entradas, cadastros e navegação).

## 🛠️ Tecnologias Utilizadas
- **Frontend:** HTML5 Semântico, CSS3 (Custom Properties/CSS Grid/Flexbox)
- **Lógica e Dinamismo:** JavaScript (ES6+, Async/Await, Fetch API, DOM Manipulation)
- **Streaming de Vídeo:** JSMpeg (Decodificação de vídeo via WebSockets)
- **Qualidade e Testes:** Cypress (Testes End-to-End simulando comportamento real do usuário)

## 🏗️ Arquitetura e Boas Práticas
O projeto foi estruturado seguindo os pilares da engenharia de software ensinados no 4º semestre de TI:
1. **Separation of Concerns (SoC):** Separação estrita entre Estrutura (HTML), Estilo (CSS) e Comportamento (JS).
2. **Clean Code:** Funções modulares, variáveis bem nomeadas e blocos `try/catch` para resiliência de erros.
3. **Mocking de API:** Utilização do `cy.intercept` no Cypress para simular o comportamento do backend, permitindo validação isolada do frontend.

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Um editor de código (como VS Code).
- Extensão **Live Server** instalada.
- Node.js instalado (para rodar os testes).

### Rodando a Aplicação
1. Clone este repositório.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito no arquivo `public/login.html` e selecione **"Open with Live Server"**.

### Rodando os Testes Automatizados (Cypress)
Para verificar a integridade do sistema, abra o terminal na raiz do projeto e execute:
```bash
# Instala as dependências (se for a primeira vez)
npm install

# Abre o painel de testes do Cypress
npx cypress open
