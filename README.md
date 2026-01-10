# 🚀 Sistema de Gestão de Pedidos (Prócion)

Aplicação desenvolvida como parte do desafio técnico. O sistema consiste em um gerenciador completo de Clientes, Produtos e Pedidos, com foco em **Responsividade Mobile**, **Integridade de Dados** e **UX/UI**.

![Badge Status](https://img.shields.io/badge/Status-Finalizado-green) ![Badge Tech](https://img.shields.io/badge/Tech-React%20%7C%20Node%20%7C%20Prisma-blue)

## 📋 Funcionalidades & Diferenciais

Além do CRUD básico, foram implementadas funcionalidades avançadas para simular um cenário real de uso:

### 📱 Mobile First & Responsividade
- Interface 100% adaptada para celulares.
- Tabelas com **scroll horizontal** automático em telas pequenas.
- Formulários com layout adaptativo (Columns no Mobile vs Rows no Desktop).

### 🛡️ Segurança e Integridade (Soft Delete)
- Implementação de **Soft Delete** para Clientes e Produtos.
- Registros não são excluídos fisicamente, apenas inativados (`ativo = false`).
- Garante integridade referencial e histórico de vendas, impedindo novos pedidos para itens inativos.

### 📄 Geração de Documentos & Compartilhamento
- Geração de **PDF** no Frontend (client-side) para não sobrecarregar o servidor.
- Integração com protocolo `mailto`: Abre automaticamente o app de e-mail do usuário já com o assunto e corpo preenchidos.
- Sistema de **Pagamentos** incluído no pedido e no comprovante.

### ✨ UX (Experiência do Usuário)
- Feedback visual imediato: Formulários mudam de cor/destaque ao entrar em "Modo de Edição".
- Feedback de carregamento e sucesso via "Toasts" (notificações flutuantes).
- Navegação centralizada e intuitiva.

---

## 🛠 Tecnologias Utilizadas

- **Frontend:** React.js, Vite, Chakra UI (Biblioteca de Componentes).
- **Backend:** Node.js, Express.
- **Banco de Dados:** SQLite (via Prisma ORM).
- **Bibliotecas Extras:** - `jspdf` e `jspdf-autotable` (Geração de PDF).
  - `axios` (Consumo de API).
  - `cors` (Segurança).
  - `nodemailer` (Preparo para envio de emails).

---

## 📦 Como Rodar o Projeto

Siga os passos abaixo para executar a aplicação localmente.

### Pré-requisitos
- Node.js instalado (Versão 16 ou superior recomendada).

### 1️⃣ Configurando o Backend (Servidor)

Abra um terminal na pasta `server`:

~~~bash
cd server

# Instalar dependências
npm install

# Criar o banco de dados e tabelas (Migração)
npx prisma migrate dev --name init

# Rodar o servidor
npm run dev
~~~
*O servidor rodará em: `http://localhost:3000`*

### 2️⃣ Configurando o Frontend (Aplicação)

Abra um **novo terminal** na pasta `web`:

~~~bash
cd web

# Instalar dependências
npm install

# Rodar a aplicação
npm run dev
~~~
*Acesse a aplicação em: `http://localhost:5173`*

---

## 📱 Testando no Celular (Opcional)

Para testar a responsividade em seu dispositivo móvel:

1. Descubra o IP da sua máquina na rede local (ex: `192.168.0.10`).
2. No arquivo `web/src/api.js`, altere `localhost` para o seu IP.
3. Rode o frontend com o comando: `npm run dev -- --host`.
4. Acesse pelo navegador do celular: `http://SEU_IP:5173`.

> **Nota:** Para a entrega final, o arquivo `api.js` foi configurado para `localhost` para garantir a execução na máquina do avaliador.

---

## 🏛 Decisões de Arquitetura

- **Por que SQLite?** Escolhido pela facilidade de configuração e portabilidade, ideal para testes técnicos e MVPs, removendo a necessidade de instalar Docker ou bancos pesados na máquina do avaliador.
- **Por que Prisma?** Para garantir *Type Safety* e agilidade nas *Migrations* do banco de dados.
- **Layout:** Utilizei Chakra UI para acelerar o desenvolvimento de uma interface acessível e moderna, focando meu tempo na lógica de negócios (Pedidos/Pagamentos).

---
Desenvolvido por Aron Marcelo Soad