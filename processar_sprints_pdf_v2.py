#!/usr/bin/env python3
"""
Script melhorado para processar dados de ciclos de teste do PDF
"""

import re
import csv
from collections import defaultdict

# Ler arquivo
with open('/home/ubuntu/upload/ciclosdeteste-2025.txt', 'r', encoding='utf-8') as f:
    texto = f.read()

# Mapeamento de nomes
def mapear_projeto(texto_projeto):
    texto_projeto = texto_projeto.upper()
    if 'CODECON' in texto_projeto:
        return 'CODECON-FISCALIZAÇÃO'
    elif 'CONTRATOS' in texto_projeto and 'SEFAZ' in texto_projeto:
        return 'SEFAZ-CONTRATOS'
    elif 'CMS' in texto_projeto or 'FOLHA' in texto_projeto:
        return 'CMS-FOLHA DE PAGAMENTO'
    elif 'FROTAS' in texto_projeto:
        return 'SEFAZ-FROTAS'
    elif 'GESTÃO' in texto_projeto or 'GPS' in texto_projeto or 'PROJETOS' in texto_projeto:
        return 'SEFAZ-GESTÃO DE PROJETOS'
    elif 'SEDUR' in texto_projeto and ('LICENCIAMENTO' in texto_projeto or 'CLE' in texto_projeto):
        return 'SEDUR-LICENCIAMENTO'
    elif 'SEDUR' in texto_projeto and 'FISCALIZAÇÃO' in texto_projeto:
        return 'SEDUR-FISCALIZAÇÃO'
    elif 'SEDUR' in texto_projeto and 'SAUSE' in texto_projeto:
        return 'SEDUR-SAUSE'
    elif 'AGENDAMENTO' in texto_projeto:
        return 'SEFAZ-AGENDAMENTO'
    elif 'RHWEB' in texto_projeto:
        return 'SEFAZ-RHWEB'
    elif 'SEMGE' in texto_projeto or 'SIGC' in texto_projeto:
        return 'SEMGE-CONTRATOS'
    elif 'LIVE' in texto_projeto and 'SIGSUAS' in texto_projeto:
        return 'LIVE-SIGSUAS'
    elif 'SEMPRE' in texto_projeto and 'SIGSUAS' in texto_projeto:
        return 'SEMPRE-SIGSUAS'
    elif 'SEDUR' in texto_projeto and 'CONTRATOS' in texto_projeto:
        return 'SEDUR-CONTRATOS'
    elif 'SMED' in texto_projeto and ('MAE' in texto_projeto or 'ALIMENTAÇÃO' in texto_projeto):
        return 'SMED-ALIMENTAÇÃO'
    return None

# Dividir em linhas e processar
linhas = texto.split('\n')

sprints_dict = {}
i = 0

while i < len(linhas):
    linha = linhas[i].strip()
    
    # Tentar identificar projeto
    projeto = mapear_projeto(linha)
    
    if projeto:
        # Coletar próximas linhas até encontrar versão e dados
        buffer = [linha]
        j = i + 1
        
        # Coletar até 10 linhas seguintes
        while j < len(linhas) and j < i + 10:
            buffer.append(linhas[j].strip())
            j += 1
        
        # Juntar buffer
        bloco = ' '.join(buffer)
        
        # Procurar versão
        versao_match = re.search(r'(\d+\.\d+\.\d+(?:\s*-\s*[\w\s]+)?|Sprint \d+(?:\.\d+)?)', bloco)
        
        if versao_match:
            versao = versao_match.group(1).strip()
            
            # Contar "TESTE" no bloco
            num_ciclos = bloco.count('TESTE')
            
            if num_ciclos > 0:
                # Extrair primeira data
                datas = re.findall(r'(\d{2}/\d{2})', bloco)
                if datas:
                    mes_num = int(datas[0].split('/')[1])
                    meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                    mes_nome = meses[mes_num] if 1 <= mes_num <= 12 else ''
                    
                    if mes_nome:
                        chave = (projeto, versao)
                        sprints_dict[chave] = {
                            'Projeto': projeto,
                            'Sprint': versao,
                            'Mes': mes_nome,
                            'Ciclos': num_ciclos
                        }
    
    i += 1

# Converter para lista
sprints_data = list(sprints_dict.values())
sprints_data.sort(key=lambda x: (x['Projeto'], x['Sprint']))

# Gerar CSV
output_file = '/home/ubuntu/Retrospectiva-QA/client/public/ciclos_por_sprint.csv'

with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Projeto', 'Sprint', 'Mes', 'Ciclos']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    for sprint in sprints_data:
        writer.writerow(sprint)

print(f"CSV gerado com {len(sprints_data)} sprints")
print(f"Arquivo: {output_file}")

# Contagem
from collections import Counter
contagem = Counter([s['Projeto'] for s in sprints_data])
print("\nSprints por projeto:")
for projeto, count in sorted(contagem.items()):
    print(f"  {projeto}: {count}")

# Exemplos
print("\nPrimeiros 15 exemplos:")
for sprint in sprints_data[:15]:
    print(f"  {sprint['Projeto']} | {sprint['Sprint']:20} | {sprint['Mes']:10} | {sprint['Ciclos']} ciclos")
