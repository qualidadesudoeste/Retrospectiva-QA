#!/usr/bin/env python3
"""
Script para processar dados de ciclos de teste do PDF e gerar CSV por sprint
Lógica correta: Contar número de colunas preenchidas (cada coluna = 1 ciclo)
"""

import re
import csv
from collections import defaultdict

# Ler arquivo de texto extraído do PDF
with open('/home/ubuntu/upload/ciclosdeteste-2025.txt', 'r', encoding='utf-8') as f:
    linhas = f.readlines()

# Estrutura para armazenar dados (dict para evitar duplicatas)
# Chave: (Projeto, Sprint) -> Valor: {Mes, Ciclos}
sprints_dict = {}

# Mapeamento de nomes
def mapear_projeto(linha):
    if 'CODECON' in linha and 'FISCALIZAÇÃO' in linha:
        return 'CODECON-FISCALIZAÇÃO'
    elif 'CONTRATOS' in linha and 'SEFAZ' in linha:
        return 'SEFAZ-CONTRATOS'
    elif 'CMS' in linha or 'FOLHA' in linha:
        return 'CMS-FOLHA DE PAGAMENTO'
    elif 'FROTAS' in linha and 'SEFAZ' in linha:
        return 'SEFAZ-FROTAS'
    elif 'GESTÃO' in linha or 'GPS' in linha or 'PROJETOS' in linha:
        return 'SEFAZ-GESTÃO DE PROJETOS'
    elif 'SEDUR' in linha and ('LICENCIAMENTO' in linha or 'CLE' in linha):
        return 'SEDUR-LICENCIAMENTO'
    elif 'SEDUR' in linha and 'FISCALIZAÇÃO' in linha:
        return 'SEDUR-FISCALIZAÇÃO'
    elif 'SEDUR' in linha and 'SAUSE' in linha:
        return 'SEDUR-SAUSE'
    elif 'SEFAZ' in linha and 'AGENDAMENTO' in linha:
        return 'SEFAZ-AGENDAMENTO'
    elif 'SEFAZ' in linha and 'RHWEB' in linha:
        return 'SEFAZ-RHWEB'
    elif 'SEMGE' in linha and ('CONTRATOS' in linha or 'SIGC' in linha):
        return 'SEMGE-CONTRATOS'
    elif 'LIVE' in linha and 'SIGSUAS' in linha:
        return 'LIVE-SIGSUAS'
    elif 'SEMPRE' in linha and 'SIGSUAS' in linha:
        return 'SEMPRE-SIGSUAS'
    elif 'SEDUR' in linha and 'CONTRATOS' in linha:
        return 'SEDUR-CONTRATOS'
    elif 'SMED' in linha and ('MAE' in linha or 'ALIMENTAÇÃO' in linha):
        return 'SMED-ALIMENTAÇÃO'
    return None

i = 0
while i < len(linhas):
    linha = linhas[i].strip()
    
    # Detectar projeto
    projeto = mapear_projeto(linha)
    
    if projeto:
        # Próxima linha pode ter a versão/sprint
        if i + 1 < len(linhas):
            linha_versao = linhas[i + 1].strip()
            
            # Procurar versão ou sprint
            versao_match = re.search(r'(\d+\.\d+\.\d+(?:\s*-\s*\w+)?|Sprint \d+(?:\.\d+)?)', linha_versao)
            
            if versao_match:
                versao = versao_match.group(1).strip()
                
                # Próxima linha deve ter os ciclos
                if i + 2 < len(linhas):
                    linha_ciclos = linhas[i + 2].strip()
                    
                    # Contar quantas vezes aparece "TESTE" ou "RE-TESTE"
                    # Cada ocorrência representa um ciclo
                    num_ciclos = linha_ciclos.count('TESTE')
                    
                    if num_ciclos > 0:
                        # Extrair primeira data para determinar o mês
                        datas = re.findall(r'(\d{2}/\d{2})', linha_ciclos)
                        if datas:
                            primeira_data = datas[0]
                            mes_num = int(primeira_data.split('/')[1])
                            meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                            mes_nome = meses[mes_num] if 1 <= mes_num <= 12 else ''
                            
                            if mes_nome:
                                # Usar dict para sobrescrever duplicatas (mantém apenas o último)
                                chave = (projeto, versao)
                                sprints_dict[chave] = {
                                    'Projeto': projeto,
                                    'Sprint': versao,
                                    'Mes': mes_nome,
                                    'Ciclos': num_ciclos
                                }
    
    i += 1

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

# Mostrar alguns exemplos
print("\nExemplos de sprints:")
for sprint in sprints_data[:10]:
    print(f"  {sprint['Projeto']} - {sprint['Sprint']}: {sprint['Ciclos']} ciclos ({sprint['Mes']})")
