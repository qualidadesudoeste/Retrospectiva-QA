# Dashboard QA 2025 - Documentação Completa

## 📋 Visão Geral

Dashboard completo de Quality Assurance desenvolvido para análise de métricas de qualidade, sprints, projetos e evolução do time de QA ao longo de 2025.

## 🎯 Funcionalidades Principais

### 1. Visão Geral
**8 Cards de Métricas:**
- Sprints Liberadas: 26 (72.2% do total)
- Score Médio: 78.7 (Qualidade geral)
- Aceite 1º Ciclo: 2.8% (Aprovadas sem erros)
- Tempo Retrabalho: 18.5% (Taxa média)
- Sprints Analisadas: 36 (Total do período)
- Total de Horas: 600h (Tempo investido em testes)
- Retrabalho em Horas: 403.4h (10.9% do tempo total)
- Projetos Ativos: 19 (Média de 347.4h por projeto)

**Recursos:**
- Gráfico Score de Qualidade por Cliente
- Animações e hover effects em todos os cards
- Design responsivo e elegante

### 2. Análise Temporal
- Cards superiores com métricas mensais agregadas
- Gráficos de evolução mensal (linhas e barras)
- Tabela detalhada com gradientes e badges coloridos
- Dados corrigidos: Novembro com 46 ciclos, 274 cards totais
- Dezembro excluído dos cálculos

### 3. Ranking
- Top 5 sprints com melhor desempenho
- Cores por posição no hover:
  * 1º lugar: Amarelo
  * 2º lugar: Azul
  * 3º lugar: Laranja
  * 4º lugar: Roxo
  * 5º lugar: Verde
- Tooltips informativos
- Ícone de joaninha para indicar retrabalho

### 4. Projetos
- Filtros por cliente e projeto
- Tabela expansível com métricas detalhadas
- Cards de resumo: Sprints, Ciclos, Horas, Retrabalho
- Label "CARDS CORREÇÃO" para retrabalho médio

### 5. Evolução (NOVA!)
**6 Cards de Transformações:**
1. **Estratégia**: QA reativo → Sistema integrado
2. **Processos**: Rituais próprios → Fluxos padronizados
3. **Testes**: Manual → Pirâmide equilibrada
4. **Métricas**: Sensação térmica → Indicadores objetivos
5. **Pessoas**: QA gargalo → QA facilitador
6. **Cultura**: Erro escondido → Erro analisado

**Recursos:**
- Animações específicas por card (spin, bounce, pulse, scale)
- Cores temáticas por categoria
- Hover effects com elevação e sombras coloridas
- Grid responsivo de 3 colunas

## 🛠️ Stack Tecnológico

- **React** 18.3.1 - Biblioteca UI
- **TypeScript** 5.6.2 - Tipagem estática
- **Vite** 7.1.9 - Build tool
- **Tailwind CSS** 3.4.17 - Framework CSS
- **Recharts** 2.15.0 - Biblioteca de gráficos
- **shadcn/ui** - Componentes UI
- **lucide-react** - Ícones
- **Wouter** 3.3.5 - Roteamento leve
- **Papa Parse** 5.4.1 - Parser CSV

## 📁 Estrutura de Arquivos

```
dashboard-qa/
├── client/src/
│   ├── components/
│   │   ├── DashboardLayout.tsx    # Layout com menu lateral
│   │   ├── ErrorBoundary.tsx      # Tratamento de erros
│   │   ├── MetricCard.tsx         # Card reutilizável
│   │   └── ui/                    # Componentes shadcn/ui
│   ├── contexts/
│   │   ├── FilterContext.tsx      # Estado de filtros
│   │   └── ThemeContext.tsx       # Tema dark/light
│   ├── pages/
│   │   ├── Home.tsx               # Visão Geral
│   │   ├── Temporal.tsx           # Análise Temporal
│   │   ├── Rankings.tsx           # Rankings
│   │   ├── Projetos.tsx           # Projetos
│   │   ├── Evolucao.tsx           # Evolução ⭐ NOVA
│   │   └── NotFound.tsx           # 404
│   ├── App.tsx                    # Rotas
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Estilos globais
├── public/data/                   # Arquivos CSV
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 18 ou superior
- pnpm (recomendado) ou npm

### Passos

```bash
# 1. Extrair o arquivo ZIP
unzip dashboard-qa-completo-*.zip
cd dashboard-qa

# 2. Instalar dependências
pnpm install

# 3. Executar em desenvolvimento
pnpm dev

# Acesse: http://localhost:3000
```

### Build para Produção

```bash
pnpm build
```

Arquivos otimizados em `dist/`

## 📊 Dados (CSV)

Localização: `public/data/`

**Arquivos:**
- `dados_novembro_filtrado.csv` - Sprints de novembro
- `analise_mensal.csv` - Dados temporais mensais
- `ranking_eficiencia_melhores.csv` - Top 5 sprints
- `metricas_por_projeto_novembro_horas.csv` - Métricas por projeto

## 🎨 Customização

### Paleta de Cores

Arquivo: `client/src/index.css`

```css
:root {
  --primary: oklch(0.65 0.25 220);      /* Azul corporativo */
  --secondary: oklch(0.60 0.20 230);    /* Azul secundário */
  --accent: oklch(0.75 0.15 80);        /* Dourado */
  --destructive: oklch(0.60 0.20 25);   /* Vermelho */
}
```

### Animações

Arquivo: `tailwind.config.ts`

```typescript
animation: {
  'spin-slow': 'spin 3s linear infinite',
  'pulse-slow': 'pulse 3s ease infinite',
  'fade-in-up': 'fadeInUp 0.6s ease-out',
}
```

## ✨ Alterações Recentes (v2.0.0)

### Labels Atualizadas
- ✅ "Aprovadas sem retrabalho" → "Aprovadas sem erros"
- ✅ "Retrabalho Médio" → "Tempo Retrabalho"
- ✅ "15 dias × 8h × 5 QAs" → "Tempo investido em testes"

### Nova Página Evolução
- ✅ Página separada no menu
- ✅ 6 cards com animações específicas
- ✅ Seção removida da Visão Geral

### Correções de Dados
- ✅ Novembro: 46 ciclos, 274 cards totais
- ✅ Rankings: Top 5 reorganizado
- ✅ Dezembro excluído dos cálculos

### Melhorias Visuais
- ✅ Tabela Análise Temporal com gradientes
- ✅ Rankings com cores por posição
- ✅ Filtro "Todos" funcional em Projetos
- ✅ Tooltips em elementos interativos

## 🐛 Solução de Problemas

### Erro ao instalar
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Porta 3000 ocupada
Editar `vite.config.ts`:
```typescript
server: { port: 3001 }
```

### Dados não carregam
- Verificar arquivos CSV em `public/data/`
- Checar console do navegador

## 📞 Contato

Dashboard desenvolvido para análise interna de QA.

---

**Versão:** 2.0.0  
**Data:** 14/12/2025  
**Status:** ✅ Produção
