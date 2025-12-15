# Dashboard QA 2025 - Código Fonte Completo

## 📋 Descrição

Dashboard completo de Quality Assurance para análise de métricas de qualidade, sprints, projetos e evolução do time de QA ao longo de 2025.

## 🎯 Funcionalidades

### 1. Visão Geral
- **8 cards de métricas principais**:
  - Sprints Liberadas (26 - 72.2% do total)
  - Score Médio (78.7 - Qualidade geral)
  - Aceite 1º Ciclo (2.8% - Aprovadas sem erros)
  - Tempo Retrabalho (18.5% - Taxa média)
  - Sprints Analisadas (36 - Total do período)
  - Total de Horas (600h - Tempo investido em testes)
  - Retrabalho em Horas (403.4h - 10.9% do tempo total)
  - Projetos Ativos (19 - Média de 347.4h por projeto)

- **Gráfico Score de Qualidade por Cliente**
- **Animações e hover effects** em todos os cards

### 2. Análise Temporal
- **Cards superiores** com métricas mensais
- **Gráficos de evolução** mensal
- **Tabela detalhada** com gradientes e badges coloridos
- **Dados corrigidos**: Novembro com 46 ciclos, 274 cards totais
- **Dezembro excluído** dos cálculos

### 3. Ranking
- **Top 5 sprints** com melhor desempenho
- **Cores por posição** no hover:
  - 🥇 1º lugar: Amarelo
  - 🥈 2º lugar: Azul
  - 🥉 3º lugar: Laranja
  - 4º lugar: Roxo
  - 5º lugar: Verde
- **Tooltips informativos**
- **Ícone de joaninha** para retrabalho

### 4. Projetos
- **Filtros por cliente e projeto**
- **Tabela expansível** com métricas detalhadas
- **Cards de resumo**: Total de Sprints, Ciclos, Horas, Retrabalho
- **Label "CARDS CORREÇÃO"** para retrabalho médio

### 5. Evolução (NOVA!)
- **6 cards de transformações**:
  1. **Estratégia**: QA reativo → Sistema integrado
  2. **Processos**: Rituais próprios → Fluxos padronizados
  3. **Testes**: Manual → Pirâmide equilibrada
  4. **Métricas**: Sensação térmica → Indicadores objetivos
  5. **Pessoas**: QA gargalo → QA facilitador
  6. **Cultura**: Erro escondido → Erro analisado

- **Animações específicas** por card (spin, bounce, pulse, scale)
- **Cores temáticas** por categoria
- **Hover effects** com elevação e sombras

## 🛠️ Tecnologias

- **React** 18.3.1
- **TypeScript** 5.6.2
- **Vite** 7.1.9
- **Tailwind CSS** 3.4.17
- **Recharts** 2.15.0 (gráficos)
- **shadcn/ui** (componentes)
- **lucide-react** (ícones)
- **Wouter** 3.3.5 (roteamento)
- **Papa Parse** 5.4.1 (CSV)

## 📁 Estrutura do Projeto

```
dashboard-qa/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx    # Layout principal com menu
│   │   │   ├── ErrorBoundary.tsx      # Tratamento de erros
│   │   │   ├── MetricCard.tsx         # Card de métrica reutilizável
│   │   │   └── ui/                    # Componentes shadcn/ui
│   │   ├── contexts/
│   │   │   ├── FilterContext.tsx      # Contexto de filtros
│   │   │   └── ThemeContext.tsx       # Contexto de tema
│   │   ├── pages/
│   │   │   ├── Home.tsx               # Visão Geral
│   │   │   ├── Temporal.tsx           # Análise Temporal
│   │   │   ├── Rankings.tsx           # Ranking
│   │   │   ├── Projetos.tsx           # Projetos
│   │   │   ├── Evolucao.tsx           # Evolução (NOVA!)
│   │   │   └── NotFound.tsx           # Página 404
│   │   ├── App.tsx                    # Configuração de rotas
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Estilos globais
│   └── public/
│       └── data/                      # Arquivos CSV
├── server/                            # Backend (se necessário)
├── shared/                            # Tipos compartilhados
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clonar ou extrair o projeto
cd dashboard-qa

# Instalar dependências
pnpm install
# ou
npm install
```

### Executar em Desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

Acesse: http://localhost:3000

### Build para Produção

```bash
pnpm build
# ou
npm run build
```

Os arquivos otimizados estarão em `dist/`

## 📊 Dados

Os dados estão em arquivos CSV na pasta `public/data/`:

- `dados_novembro_filtrado.csv` - Sprints de novembro
- `analise_mensal.csv` - Análise temporal mensal
- `ranking_eficiencia_melhores.csv` - Top 5 sprints
- `metricas_por_projeto_novembro_horas.csv` - Métricas por projeto

### Formato dos CSVs

**dados_novembro_filtrado.csv**:
```csv
cliente,projeto,sprint,inicio,fim,duracao,num_ciclos,retrabalho,score_qualidade,classificacao,status_simplificado,atrasada,aceite_1ciclo
```

**analise_mensal.csv**:
```csv
MesNome,TotalSprints,TotalCiclos,CardsTotal,CardsCorrecao,RetrabalhoPercentual
```

## 🎨 Customização

### Cores

As cores estão definidas em `client/src/index.css`:

```css
:root {
  --primary: oklch(0.65 0.25 220);      /* Azul corporativo */
  --secondary: oklch(0.60 0.20 230);    /* Azul secundário */
  --accent: oklch(0.75 0.15 80);        /* Dourado */
  --destructive: oklch(0.60 0.20 25);   /* Vermelho suave */
}
```

### Animações

Animações customizadas em `tailwind.config.ts`:

```typescript
animation: {
  'spin-slow': 'spin 3s linear infinite',
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
}
```

## 📝 Alterações Recentes

### Versão Atual (14/12/2025)

✅ **Labels atualizadas na Visão Geral**:
- "Aprovadas sem retrabalho" → "Aprovadas sem erros"
- "Retrabalho Médio" → "Tempo Retrabalho"
- "15 dias × 8h × 5 QAs" → "Tempo investido em testes"

✅ **Nova página Evolução**:
- Criada página separada no menu
- 6 cards com animações específicas
- Seção removida da Visão Geral

✅ **Dados corrigidos**:
- Novembro: 46 ciclos, 274 cards totais
- Rankings: Top 5 sem sprints específicas removidas

✅ **Melhorias visuais**:
- Tabela Análise Temporal com gradientes
- Rankings com cores por posição
- Projetos com filtro "Todos" funcional
- Tooltips em todos os elementos interativos

## 🐛 Troubleshooting

### Erro ao instalar dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Porta 3000 já em uso
```bash
# Alterar porta em vite.config.ts
server: {
  port: 3001
}
```

### Dados não carregam
- Verificar se os arquivos CSV estão em `public/data/`
- Verificar console do navegador para erros

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar a documentação em `/docs`
- Consultar arquivos `.md` na raiz do projeto
- Revisar logs do console

## 📄 Licença

Projeto interno - Todos os direitos reservados

---

**Última atualização**: 14/12/2025  
**Versão**: 2.0.0  
**Status**: ✅ Produção
