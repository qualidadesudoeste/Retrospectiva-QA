# Dashboard QA 2025 - Estrutura do Projeto

## Visão Geral

Este é um projeto de **Dashboard de Quality Assurance (QA)** desenvolvido com stack moderna de tecnologias web, incluindo React, TypeScript, Vite e TailwindCSS.

## Stack Tecnológica

### Frontend
- **React 18.3.1** - Biblioteca principal para UI
- **TypeScript 5.6.3** - Tipagem estática
- **Vite 7.1.9** - Build tool e dev server
- **TailwindCSS 4.1.14** - Framework CSS utilitário
- **Wouter 3.3.5** - Roteamento leve para React
- **Recharts 2.15.4** - Biblioteca de gráficos
- **Radix UI** - Componentes acessíveis (múltiplos pacotes)
- **Framer Motion 12.23.22** - Animações
- **React Query 4.41.0** - Gerenciamento de estado assíncrono
- **PapaParse 5.5.3** - Parser de CSV
- **Lucide React** - Ícones

### Backend
- **Express 4.21.2** - Servidor web Node.js
- **Axios 1.12.0** - Cliente HTTP

### Ferramentas de Desenvolvimento
- **ESBuild 0.25.0** - Bundler rápido
- **Prettier 3.6.2** - Formatação de código
- **TSX 4.19.1** - Execução de TypeScript

## Estrutura de Diretórios

```
dashboard-qa/
├── client/                    # Aplicação frontend
│   ├── public/               # Arquivos CSV de dados
│   │   ├── dados_qa.csv
│   │   ├── analise_mensal.csv
│   │   ├── metricas_qualidade_projeto.csv
│   │   ├── ranking_eficiencia.csv
│   │   └── ... (25 arquivos CSV no total)
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # Componentes UI base
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ManusDialog.tsx
│   │   │   └── MetricCard.tsx
│   │   ├── pages/           # Páginas/rotas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── Temporal.tsx
│   │   │   ├── Rankings.tsx
│   │   │   ├── Projetos.tsx
│   │   │   ├── Novembro.tsx
│   │   │   ├── Upload.tsx
│   │   │   └── NotFound.tsx
│   │   ├── contexts/        # Context API do React
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários
│   │   ├── types/           # Definições TypeScript
│   │   ├── App.tsx          # Componente raiz
│   │   ├── main.tsx         # Entry point
│   │   ├── const.ts         # Constantes
│   │   └── index.css        # Estilos globais
│   └── index.html           # HTML base
├── server/
│   └── index.ts             # Servidor Express
├── shared/
│   └── const.ts             # Constantes compartilhadas
├── patches/
│   └── wouter@3.7.1.patch   # Patch para biblioteca wouter
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── components.json          # Configuração de componentes

```

## Rotas da Aplicação

O projeto possui as seguintes rotas configuradas:

1. **`/`** - Home (página principal)
2. **`/temporal`** - Análise temporal
3. **`/rankings`** - Rankings de eficiência e qualidade
4. **`/projetos`** - Visão por projetos
5. **`/404`** - Página não encontrada

## Dados

O dashboard trabalha com **25 arquivos CSV** localizados em `client/public/`, incluindo:

- Dados de QA consolidados
- Análises mensais (geral e por cliente)
- Métricas de qualidade por projeto e cliente
- Rankings de eficiência (melhores e piores)
- Dados de ciclos e progressão acumulada
- Timeline de projetos
- Estatísticas por cliente e projeto
- Dados específicos de novembro (consolidado e filtrado)

## Scripts Disponíveis

- **`pnpm dev`** - Inicia servidor de desenvolvimento
- **`pnpm build`** - Build de produção (frontend + backend)
- **`pnpm start`** - Inicia aplicação em modo produção
- **`pnpm preview`** - Preview do build
- **`pnpm check`** - Verificação de tipos TypeScript
- **`pnpm format`** - Formatação de código com Prettier

## Tema

O projeto utiliza **tema claro** como padrão (`defaultTheme="light"` no `ThemeProvider`), com suporte a troca de tema via contexto.

## Status Atual

✅ Projeto extraído com sucesso  
✅ Dependências instaladas  
✅ Estrutura analisada  
✅ Pronto para desenvolvimento ou modificações

## Próximos Passos Sugeridos

1. Executar `pnpm dev` para iniciar o servidor de desenvolvimento
2. Acessar `http://localhost:5173` para visualizar o dashboard
3. Realizar modificações conforme necessário
4. Testar funcionalidades existentes
