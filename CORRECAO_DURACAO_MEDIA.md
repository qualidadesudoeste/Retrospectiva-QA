# Correção da Duração Média

## Problema Identificado

A "Duração Média" estava mostrando a duração total do projeto em dias, quando deveria mostrar a duração média por sprint.

## Solução Implementada

Alterado o cálculo para: **Duração Total ÷ Número de Ciclos**

### Código Atualizado

```tsx
// Antes
<p className="text-lg font-bold text-foreground">{projeto.DuracaoDias || 0} dias</p>

// Depois
<p className="text-lg font-bold text-foreground">
  {projeto.NumCiclos && projeto.DuracaoDias 
    ? (projeto.DuracaoDias / projeto.NumCiclos).toFixed(1) 
    : '0'} dias
</p>
```

## Exemplos de Cálculos Corretos

### CMS - FOLHA DE PAGAMENTO
- Duração Total: 612 dias
- Número de Ciclos: 24
- **Duração Média: 25.5 dias** (612 ÷ 24)

### CODECON - FISCALIZAÇÃO
- Duração Total: 127 dias
- Número de Ciclos: 19
- **Duração Média: 6.7 dias** (127 ÷ 19)

### LIVE - EDUCAÇÃO
- Duração Total: 228 dias
- Número de Ciclos: 7
- **Duração Média: 32.6 dias** (228 ÷ 7)

### LIVE - SIGSUAS
- Duração Total: 604 dias
- Número de Ciclos: 26
- **Duração Média: 23.2 dias** (604 ÷ 26)

### SEFAZ - RHWEB
- Duração Total: 1886 dias
- Número de Ciclos: 8
- **Duração Média: 235.8 dias** (1886 ÷ 8)

### SEMOB - SYSMOBI
- Duração Total: 1321 dias
- Número de Ciclos: 81
- **Duração Média: 16.3 dias** (1321 ÷ 81)

## Resultado

Agora a "Duração Média" representa corretamente a duração média de cada sprint do projeto, facilitando a análise de performance e planejamento.
