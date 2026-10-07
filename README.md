# 🛠️ Elas Fazem - Marketplace de Serviços por e para Mulheres

![Angular](https://img.shields.io/badge/Angular-18%2B-DD0031?style=for-the-badge&logo=angular)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

O **Elas Fazem** é uma plataforma focada em conectar contratantes a prestadoras de serviços locais de manutenção, hidráulica, elétrica e reformas exclusivas por e para mulheres, promovendo segurança, conforto e representatividade.

---

## 🎨 Layout e Identidade Visual

A interface foi projetada com foco em usabilidade, contraste acessível e uma paleta moderna baseada em **Rosa, Lilás e Roxo**:

- **Roxo Intenso (`#6d28d9`):** Ações principais, botões de destaque e navegação.
- **Rosa Magenta (`#ec4899`):** Badges, gradientes de destaque e CTA.
- **Lilás Suave (`#f3e8ff`):** Fundo de cards, hovers e elementos decorativos.

---

## 💡 Recursos e Funcionalidades (MVP)

- **📍 Geolocalização Precisa:** Filtro e ordenação de prestadoras de serviços por proximidade geográfica (raio de distância em KM).
- **🔎 Busca em Tempo Real:** Filtro reativo por nome da profissional, categoria ou descrição do serviço.
- **💬 Chat em Tempo Real:** Comunicação direta entre contratante e prestadora via WebSockets.
- **🔐 Autenticação & Perfil:** Sistema de cadastro/login e gestão de perfil integrado ao Supabase Auth.
- **⚡ Gerenciamento de Estado Moderno:** Uso nativo de **Angular Signals** (`signal`, `update`, `computed`) para reatividade sem vazamento de memória.

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura limpa e modular baseada em **Standalone Components** do Angular:

```text
src/app/
├── core/
│   ├── models/          # Interfaces e Tipos TypeScript (Provider, Message, Profile)
│   └── services/        # Serviços globais (Supabase, Auth, Provider, Chat)
├── features/
│   ├── auth/            # Componente de Login e Cadastro
│   ├── provider-list/   # Componente de listagem e busca por geolocalização
│   ├── chat/            # Componente de chat em tempo real
│   └── profile/         # Componente de perfil da usuária
├── app.component.ts     # Navbar global e layout base
└── app.routes.ts        # Mapeamento e navegação de rotas

🛠️ Tecnologias Utilizadas
Frontend: Angular 18+ (Standalone Components, Signals, New Control Flow @if / @for)

Estilização: Tailwind CSS + PostCSS

Backend & Banco de Dados: Supabase (PostgreSQL, PostGIS para queries geoespaciais, Realtime Engine)

Deploy: Vercel

⚙️ Como Executar o Projeto Localmente
Pré-requisitos
Node.js: v18.19.0 ou superior

Angular CLI: v18.x ou superior

Passo a Passo
Clone o repositório:

Bash
git clone [https://github.com/SEU_USUARIO/elas-fazem.git](https://github.com/SEU_USUARIO/elas-fazem.git)
cd elas-fazem
Instale as dependências:

Bash
npm install
Configure as Variáveis de Ambiente:
Crie o arquivo src/environments/environment.ts com suas chaves do Supabase:

TypeScript
export const environment = {
  production: false,
  supabaseUrl: '[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)',
  supabaseAnonKey: 'sua-chave-anon'
};
Execute o servidor de desenvolvimento:

Bash
ng serve
Acesse a aplicação em http://localhost:4200/.

🚀 Deploy
O projeto conta com o arquivo vercel.json pré-configurado para suporte a roteamento de Single Page Applications (SPA) na Vercel:

JSON
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
Desenvolvido com 💜 para fortalecer e incentivar mulheres na área da manutenção e tecnologia.


---

### Como salvar no seu repositório pelo terminal:

1. Abra o arquivo `README.md` na raiz do projeto.
2. Cole todo o conteúdo acima e substitua `SEU_USUARIO` pela sua conta do GitHub.
3. Suba o arquivo para o repositório executando no terminal:

```bash
git add README.md
git commit -m "docs: adiciona README completo do projeto Elas Fazem"
git push origin main
