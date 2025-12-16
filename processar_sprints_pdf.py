#!/usr/bin/env python3
"""
Script para processar dados de ciclos de teste do PDF e gerar CSV por sprint
Considera apenas o último dado de ciclo de teste de cada sprint (evita duplicatas)
"""

import re
import csv
from datetime import datetime
from collections import defaultdict

# Ler arquivo de texto extraído do PDF
with open('/home/ubuntu/upload/ciclosdeteste-2025.txt', 'r', encoding='utf-8') as f:
    texto = f.read()

# Estrutura para armazenar dados (dict para evitar duplicatas)
# Chave: (Projeto, Sprint) -> Valor: {Mes, Ciclos}
sprints_dict = {}

# Processar linha por linha
linhas = texto.split('\n')

projeto_atual = None
versao_atual = None

for i, linha in enumerate(linhas):
    linha = linha.strip()
    
    # Detectar nome do projeto
    if any(p in linha for p in ['CODECON', 'CONTRATOS', 'SEFAZ', 'CMS', 'FOLHA', 'FROTAS', 
                                  'GESTÃO', 'SEDUR', 'LICENCIAMENTO', 'FISCALIZAÇÃO', 'SAUSE',
                                  'AGENDAMENTO', 'RHWEB', 'SEMGE', 'LIVE', 'SIGSUAS', 'SEMPRE',
                                  'SMED', 'MAE', 'ALIMENTAÇÃO']):
        # Mapear nomes do PDF para nomes usados no dashboard
        if 'CODECON' in linha and 'FISCALIZAÇÃO' in linha:
            projeto_atual = 'CODECON-FISCALIZAÇÃO'
        elif 'CONTRATOS' in linha and 'SEFAZ' in linha:
            projeto_atual = 'SEFAZ-CONTRATOS'
        elif 'CMS' in linha or 'FOLHA' in linha:
            projeto_atual = 'CMS-FOLHA DE PAGAMENTO'
        elif 'FROTAS' in linha and 'SEFAZ' in linha:
            projeto_atual = 'SEFAZ-FROTAS'
        elif 'GESTÃO' in linha or 'PROJETOS' in linha:
            projeto_atual = 'SEFAZ-GESTÃO DE PROJETOS'
        elif 'SEDUR' in linha and 'LICENCIAMENTO' in linha:
            projeto_atual = 'SEDUR-LICENCIAMENTO'
        elif 'SEDUR' in linha and 'FISCALIZAÇÃO' in linha:
            projeto_atual = 'SEDUR-FISCALIZAÇÃO'
        elif 'SEDUR' in linha and 'SAUSE' in linha:
            projeto_atual = 'SEDUR-SAUSE'
        elif 'SEFAZ' in linha and 'AGENDAMENTO' in linha:
            projeto_atual = 'SEFAZ-AGENDAMENTO'
        elif 'SEFAZ' in linha and 'RHWEB' in linha:
            projeto_atual = 'SEFAZ-RHWEB'
        elif 'SEMGE' in linha and 'CONTRATOS' in linha:
            projeto_atual = 'SEMGE-CONTRATOS'
        elif 'LIVE' in linha and 'SIGSUAS' in linha:
            projeto_atual = 'LIVE-SIGSUAS'
        elif 'SEMPRE' in linha and 'SIGSUAS' in linha:
            projeto_atual = 'SEMPRE-SIGSUAS'
        elif 'SEDUR' in linha and 'CONTRATOS' in linha:
            projeto_atual = 'SEDUR-CONTRATOS'
        elif 'SMED' in linha and ('MAE' in linha or 'ALIMENTAÇÃO' in linha):
            projeto_atual = 'SMED-ALIMENTAÇÃO'
    
    # Detectar versão/sprint
    if projeto_atual:
        # Procurar por padrões de versão ou sprint
        versao_match = re.search(r'(\d+\.\d+\.\d+|Sprint \d+(?:\.\d+)?)', linha)
        if versao_match:
            versao_atual = versao_match.group(1)
        
        # Procurar por datas de ciclos (formato DD/MM)
        datas = re.findall(r'(\d{2}/\d{2})', linha)
        if datas and versao_atual:
            # Contar ciclos (TESTE + RE-TESTE)
            num_ciclos = linha.count('TESTE')
            
            if num_ciclos > 0:
                # Extrair mês da primeira data
                primeira_data = datas[0]
                mes_num = int(primeira_data.split('/')[1])
                meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                mes_nome = meses[mes_num] if mes_num <= 12 else ''
                
                if mes_nome:
                    # Usar dict para sobrescrever duplicatas (mantém apenas o último)
                    chave = (projeto_atual, versao_atual)
                    sprints_dict[chave] = {
                        'Projeto': projeto_atual,
                        'Sprint': versao_atual,
                        'Mes': mes_nome,
                        'Ciclos': num_ciclos
                    }
                    
                    # Reset versão para evitar reutilização
                    versao_atual = None

# Converter dict para lista
sprints_data = list(sprints_dict.values())

# Ordenar por projeto e depois por sprint
sprints_data.sort(key=lambda x: (x['Projeto'], x['Sprint']))

# Gerar CSV
output_file = '/home/ubuntu/Retrospectiva-QA/client/public/ciclos_por_sprint.csv'

with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Projeto', 'Sprint', 'Mes', 'Ciclos']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    for sprint in sprints_data:
        writer.writerow(sprint)

print(f"CSV gerado com {len(sprints_data)} sprints únicas")
print(f"Arquivo salvo em: {output_file}")

# Mostrar contagem por projeto
from collections import Counter
contagem = Counter([s['Projeto'] for s in sprints_data])
print("\nSprints por projeto:")
for projeto, count in sorted(contagem.items()):
    print(f"  {projeto}: {count} sprints")
