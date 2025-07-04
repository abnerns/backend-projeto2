# Sistema MVC com Express - Projeto de Autenticação

Este é um projeto completo de sistema MVC (Model-View-Controller) desenvolvido com Express.js, que inclui autenticação de usuários, páginas protegidas, sessões, cookies e interface moderna.

## 🚀 Funcionalidades

### ✅ Funcionalidades Implementadas

- **Arquitetura MVC completa** com separação clara de responsabilidades
- **Página de login interativa** com design moderno e responsivo
- **Página protegida (Dashboard)** acessível apenas após autenticação
- **Sistema de autenticação** com validação de credenciais do banco de dados
- **Gerenciamento de sessões e cookies** com Express Session
- **Banco de dados SQLite** com modelo de usuário e hash de senhas
- **Frontend responsivo** com HTML5, CSS3 e JavaScript vanilla
- **Middleware de segurança** com proteção de rotas e validações
- **Interface moderna** com animações, gráficos e componentes interativos

### 🎨 Design e UX

- **Design responsivo** que funciona em desktop e mobile
- **Animações suaves** e transições CSS
- **Gráficos interativos** no dashboard (linha e rosca)
- **Sistema de notificações** com feedback visual
- **Sidebar colapsível** com navegação intuitiva
- **Tema moderno** com gradientes e sombras

### 🔒 Segurança

- **Hash de senhas** com bcrypt
- **Proteção de rotas** com middleware de autenticação
- **Validação de sessões** com regeneração periódica
- **Rate limiting** para prevenir ataques de força bruta
- **Logging de atividades** de autenticação
- **Sanitização de dados** de entrada

## 📁 Estrutura do Projeto

```
mvc-express-project/
├── app.js                 # Arquivo principal da aplicação
├── package.json           # Dependências e scripts
├── database.sqlite        # Banco de dados SQLite (criado automaticamente)
├── config/
│   └── database.js        # Configuração do banco de dados
├── controllers/
│   ├── authController.js  # Controller de autenticação
│   └── pageController.js  # Controller de páginas
├── middleware/
│   └── authMiddleware.js  # Middleware de autenticação e segurança
├── models/
│   └── User.js           # Modelo de usuário
├── views/
│   ├── login.ejs         # Página de login
│   └── dashboard.ejs     # Página do dashboard
└── public/
    ├── css/
    │   ├── style.css     # CSS principal
    │   ├── login.css     # CSS da página de login
    │   └── dashboard.css # CSS do dashboard
    └── js/
        ├── main.js       # JavaScript principal
        ├── login.js      # JavaScript da página de login
        └── dashboard.js  # JavaScript do dashboard
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **bcrypt** - Hash de senhas
- **express-session** - Gerenciamento de sessões
- **EJS** - Template engine

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e animações
- **JavaScript (Vanilla)** - Interatividade
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes)

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd mvc-express-project
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   npm start
   # ou
   node app.js
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3001
   ```

## 👤 Contas de Teste

O sistema vem com 3 contas pré-configuradas para teste:

| Usuário | Senha   | Descrição |
|---------|---------|-----------|
| admin   | 123456  | Conta administrativa |
| usuario | senha123| Conta de usuário padrão |
| teste   | teste123| Conta para testes |

## 📱 Funcionalidades da Interface

### Página de Login
- **Formulário interativo** com validação em tempo real
- **Toggle de visibilidade** da senha
- **Animações de entrada** dos elementos
- **Contas de demonstração** clicáveis
- **Feedback visual** para erros e sucessos
- **Opção "Lembrar de mim"** com localStorage

### Dashboard (Página Protegida)
- **Sidebar responsiva** com navegação
- **Cards de estatísticas** com animações
- **Gráficos interativos** (linha e rosca)
- **Lista de atividades** recentes
- **Menu do usuário** com dropdown
- **Notificações** e badges
- **Logout seguro** com confirmação

## 🔧 Configurações

### Sessões
- **Duração**: 24 horas
- **Regeneração**: A cada 30 minutos
- **Cookie seguro**: Configurado para desenvolvimento

### Banco de Dados
- **Tipo**: SQLite (arquivo local)
- **Localização**: `./database.sqlite`
- **Criação automática** de tabelas e usuários

### Segurança
- **Rate limiting**: 5 tentativas por 15 minutos
- **Hash de senhas**: bcrypt com salt 10
- **Validação de sessões**: Verificação contínua
- **Proteção CSRF**: Implementada (básica)

## 🎯 Rotas da Aplicação

### Rotas Públicas
- `GET /` - Redirecionamento inteligente
- `GET /login` - Página de login
- `POST /login` - Processamento do login
- `GET /logout` - Logout do usuário

### Rotas Protegidas
- `GET /dashboard` - Dashboard principal
- `GET /profile` - Perfil do usuário
- `GET /settings` - Configurações
- `GET /api/status` - API de status (JSON)

## 🧪 Testando a Aplicação

### Teste de Login
1. Acesse `http://localhost:3001`
2. Use uma das contas de teste
3. Verifique o redirecionamento para o dashboard

### Teste de Proteção de Rotas
1. Tente acessar `http://localhost:3001/dashboard` sem login
2. Verifique o redirecionamento para login
3. Faça login e tente novamente

### Teste de Logout
1. No dashboard, clique em "Sair"
2. Confirme o redirecionamento para login
3. Tente acessar rotas protegidas novamente

## 📊 Recursos do Dashboard

### Estatísticas
- **Total de usuários** no sistema
- **Visualizações** da aplicação
- **Vendas** (dados de exemplo)
- **Receita** (dados de exemplo)

### Gráficos
- **Atividade Recente**: Gráfico de linha com dados semanais
- **Distribuição por Categoria**: Gráfico de rosca com percentuais

### Atividades
- **Lista em tempo real** de atividades do sistema
- **Timestamps** atualizados automaticamente
- **Ícones** representativos para cada tipo

## 🔄 Funcionalidades Avançadas

### JavaScript Interativo
- **Validação em tempo real** nos formulários
- **Animações CSS** controladas por JavaScript
- **Gráficos desenhados** com Canvas API
- **Notificações dinâmicas** com auto-fechamento
- **Sidebar responsiva** com estado persistente

### Responsividade
- **Design mobile-first** com breakpoints
- **Menu hambúrguer** para dispositivos móveis
- **Cards adaptáveis** que se reorganizam
- **Tipografia escalável** com unidades relativas

## 🛡️ Middleware de Segurança

### AuthMiddleware
- `requireAuth`: Protege rotas que precisam de autenticação
- `requireGuest`: Redireciona usuários já logados
- `addUserToViews`: Adiciona dados do usuário às views
- `logAuthActivity`: Registra atividades de autenticação
- `rateLimit`: Limita tentativas de login
- `validateSession`: Valida e regenera sessões

## 📝 Logs e Monitoramento

### Logs de Autenticação
- **Timestamp** de cada tentativa
- **IP** do usuário
- **User Agent** do navegador
- **Status** da requisição
- **URL** acessada

### Atividades Registradas
- Tentativas de login (sucesso/falha)
- Acessos a rotas protegidas
- Logout de usuários
- Regeneração de sessões

## 🚀 Próximos Passos

### Melhorias Possíveis
- [ ] Implementar recuperação de senha
- [ ] Adicionar sistema de roles/permissões
- [ ] Criar API REST completa
- [ ] Implementar testes automatizados
- [ ] Adicionar Docker para containerização
- [ ] Integrar com banco de dados PostgreSQL/MySQL
- [ ] Implementar autenticação OAuth (Google, Facebook)
- [ ] Adicionar sistema de notificações em tempo real

### Deployment
- [ ] Configurar para produção (HTTPS, variáveis de ambiente)
- [ ] Implementar CI/CD
- [ ] Configurar monitoramento e alertas
- [ ] Otimizar performance e caching
