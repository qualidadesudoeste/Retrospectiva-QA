# Ajustes Pendentes

## Cards com Fundo Claro na Página Temporal

Os 4 cards de métricas na página Temporal ainda estão com fundo claro (branco/cinza claro).

Esses cards precisam ser ajustados para:
- Fundo escuro (bg-card)
- Bordas neon sutis conforme a cor do ícone
- Texto claro

Localização: `/client/src/pages/Temporal.tsx`

Classes que precisam ser alteradas nos cards de métricas:
- Remover gradientes `bg-gradient-to-br from-white to-*-50`
- Adicionar `bg-card` como fundo
- Adicionar bordas neon apropriadas
- Ajustar cores de texto para `text-foreground`
