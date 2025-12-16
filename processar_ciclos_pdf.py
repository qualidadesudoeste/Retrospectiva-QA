#!/usr/bin/env python3
"""
Script para processar dados de ciclos de teste do PDF e gerar CSV
com evolução mensal de ciclos por projeto
"""

import re
import csv
from collections import defaultdict
from datetime import datetime

# Mapeamento de mês número para nome
MESES = {
    1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
    5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
    9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
}

def extrair_mes_de_data(data_str):
    """Extrai o mês de uma string de data no formato DD/MM"""
    if not data_str or 'TESTE' in data_str or 'RE-TESTE' in data_str:
        return None
    
    # Procurar padrão DD/MM
    match = re.search(r'(\d{2})/(\d{2})', data_str)
    if match:
        mes = int(match.group(2))
        return mes
    return None

def contar_ciclos_linha(linha_dados):
    """Conta quantos ciclos uma linha possui (campos não vazios após 1º Ciclo)"""
    # Assumindo que os ciclos começam na coluna 3 (após Projeto, Versão, 1º Ciclo)
    ciclos = 0
    for i in range(2, min(12, len(linha_dados))):  # Até 10º Ciclo
        if linha_dados[i] and linha_dados[i].strip():
            ciclos += 1
    return ciclos

# Dados extraídos manualmente do PDF (principais projetos)
dados_projetos = {
    'CODECON': [
        ('1.0.0', '01/08', 2),
        ('10.0.0', '06/11', 1),
        ('2.0.0', '11/08', 3),
        ('3.0.0', '19/08', 2),
        ('4.0.0', '12/09', 2),
        ('5.0.0', '22/09', 2),
        ('6.0.0', '01/10', 2),
        ('7.0.0', '08/10', 1),
        ('8.0.0', '14/10', 2),
        ('9.0.0', '29/10', 2),
    ],
    'CONTRATOS-SEFAZ': [
        ('2.0.2', '12/03', 3),
        ('2.0.3', '30/06', 3),
        ('2.0.4', '17/07', 2),
        ('3.0.0-APO', '12/09', 4),
        ('3.0.1-APO2', '19/11', 2),
        ('Sustentação', '07/08', 1),
    ],
    'EDUCAÇÃO-LIVE': [
        ('Sprint1', '14/05', 2),
        ('Sprint2', '01/10', 1),
        ('Sprint3', '17/10', 1),
        ('Sprint4', '16/10', 2),
        ('Sprint5', '07/11', 1),
        ('Sprint6', '31/10', 1),
    ],
    'FPG-CMS-MAKER5': [
        ('1.0.0', '17/09', 3),
        ('2.0.0', '16/09', 6),
        ('3.0.1', '27/08', 6),
        ('4.0.0', '08/08', 5),
        ('5.0.0', '02/09', 5),
        ('6.0.0', '26/09', 2),
    ],
    'FROTAS-SEFAZ': [
        ('0.0', '19/08', 1),
        ('1.0-Mobile', '11/02', 3),
        ('2.0', '29/08', 1),
        ('3.0', '26/03', 4),
        ('4.0-MB', '21/07', 3),
    ],
    'GPS-PROJETOS': [
        ('1.0.0', '07/10', 3),
        ('2.0.0', '07/11', 3),
        ('3.0.0', '18/11', 4),
        ('4.0.0', '02/12', 1),
    ],
    'PMFSA-SIGP': [
        ('11.0.0-ESO', '07/02', 1),
        ('12.0.0-ESO', '07/02', 1),
        ('12.0.0-FPG', '10/02', 1),
        ('13.0.0-ESO', '07/02', 1),
        ('13.0.0-FPG', '10/02', 1),
        ('14.0.0-ESO', '07/02', 1),
        ('14.0.0-FPG', '10/02', 1),
    ],
    'PRODEB-SICAF': [
        ('19.0.0', '16/01', 6),
        ('20.0.0', '18/02', 3),
        ('21.0.0', '05/03', 3),
        ('22.0.0', '21/03', 2),
        ('24.0.0', '03/06', 1),
        ('25.0.0', '13/06', 1),
        ('26.0.0', '17/07', 1),
        ('27.0.0', '25/07', 1),
    ],
    'PRODEB-SIGC': [
        ('Sprint10', '09/05', 1),
        ('Sprint11', '26/06', 3),
        ('Sprint12', '26/06', 3),
        ('Sprint13', '05/08', 2),
        ('Sprint14', '20/08', 1),
    ],
    'SALVADOR-FILM': [
        ('6.2.0', '03/02', 3),
        ('6.2.1', '26/02', 4),
        ('6.2.2', '10/03', 5),
        ('7.0.0', '27/06', 3),
    ],
    'SEDUR-CLE': [
        ('21.0.0', '02/01', 1),
        ('22.0.0', '23/01', 3),
        ('23.0.0', '10/02', 3),
        ('24.0.0', '19/02', 3),
        ('25.0.0', '26/02', 1),
        ('26.0.0', '14/03', 2),
        ('27.0.0', '27/03', 2),
        ('28.0.0', '08/04', 2),
        ('29.0.0', '22/04', 2),
        ('30.0.0', '30/04', 1),
        ('31.0.0', '09/05', 1),
        ('32.0.0', '16/07', 3),
        ('33.0.0', '11/11', 2),
        ('34.0.0', '04/11', 2),
        ('35.0.0', '19/11', 2),
        ('36.0.0', '24/11', 1),
    ],
    'SEDUR-FISCALIZAÇÃO': [
        ('Sprint10', '07/09', 2),
        ('Sprint11', '02/10', 3),
        ('Sprint12', '16/10', 3),
        ('Sprint13', '28/10', 2),
        ('Sprint14', '07/11', 1),
        ('Sprint15', '17/11', 2),
        ('Sprint16', '21/11', 2),
    ],
    'SEDUR-SAUSE': [
        ('18.0.0', '02/10', 1),
        ('19.0.0', '02/10', 1),
    ],
    'SEFAZ-RHWEB': [
        ('0.0.0', '14/08', 1),
        ('10.2.0-Corr', '22/07', 1),
        ('11.0.0-Melh', '17/04', 2),
        ('11.1.0-Corr', '30/06', 4),
        ('7.0.0-Freq', '18/08', 1),
    ],
    'SEFAZ-AGENDAMENTO': [
        ('0.0.0', '14/07', 2),
        ('10.0.0-Timer', '07/03', 2),
        ('11.0.0-Corr', '08/05', 2),
        ('8.1.0-Correção', '06/03', 1),
        ('9.0.0-Dash', '18/02', 2),
    ],
    'SEMED-SIE': [
        ('Sprint01', '01/10', 1),
        ('Sprint16', '16/01', 1),
        ('Sprint17', '16/01', 1),
        ('Sprint18', '26/03', 1),
        ('Sprint19', '27/05', 1),
        ('Sprint20', '04/07', 1),
        ('Sprint21', '04/07', 3),
        ('Sprint22', '11/08', 1),
        ('Sprint23', '03/10', 3),
        ('Sprint24', '11/11', 1),
        ('Sprint26', '01/12', 1),
    ],
    'SEMGE-SIGC': [
        ('31.0.0', '07/01', 1),
        ('33.0.0', '13/01', 2),
        ('34.0.0', '16/01', 2),
        ('35.0.0', '31/01', 4),
        ('36.0.0', '20/02', 3),
        ('37.0.0', '06/03', 2),
        ('38.0.0', '10/03', 2),
        ('39.0.0', '20/03', 2),
        ('40.0.0', '03/04', 3),
        ('41.0.0', '16/04', 2),
        ('42.0.0', '09/05', 2),
        ('43.0.0', '20/05', 6),
        ('44.0.0', '04/06', 3),
        ('45.0.0', '04/07', 3),
        ('46.0.0', '24/07', 2),
        ('47.0.0', '31/07', 3),
        ('48.0.0', '07/08', 2),
        ('49.0.0', '26/08', 2),
        ('50.0.0', '12/09', 2),
    ],
    'SEMIT-SGTIC': [
        ('18.0.0', '25/03', 1),
    ],
    'SEMOP-SGCI': [
        ('1.8.0', '25/09', 2),
        ('1.9.0', '06/11', 1),
    ],
    'SIGP-SSA': [
        ('SIGP-26.0.0', '05/05', 1),
    ],
    'SIGSUAS-VIDA-NOVA': [
        ('13.3.0', '20/01', 1),
        ('14.0.0-A', '19/08', 2),
        ('14.1.0-B', '17/09', 2),
        ('14.2.0-C', '30/09', 2),
        ('14.3.0-D', '22/10', 1),
        ('14.4.0-E', '10/11', 1),
        ('14.5.0-F', '24/11', 1),
        ('15.0.0-UA/CV', '05/02', 2),
        ('15.1.0-CORR', '29/04', 1),
        ('15.2.0-CORR', '30/04', 2),
        ('15.3.0-CORR', '28/07', 3),
        ('15.4.0-CORR', '23/10', 2),
        ('3.8.0-PSB', '21/05', 1),
    ],
    'SIGSUAS-LIVE': [
        ('1.0.0-CRAS', '10/02', 1),
        ('10.0.0-IV', '04/08', 2),
        ('11.0.0-V', '28/08', 2),
        ('12.0.0-VI', '16/09', 3),
        ('13.0.0-VII', '30/09', 3),
        ('14.0.0-VIII', '23/10', 3),
        ('15.0.0-IX', '14/11', 2),
        ('16.0.0-X', '01/12', 1),
        ('2.0.0-CREAS', '10/02', 2),
        ('3.0.0-SAICA', '14/02', 1),
        ('4.0.0-SAN', '20/03', 2),
        ('5.0.0-HAB', '06/03', 1),
        ('6.0.0-CT', '02/06', 3),
        ('7.0.0-I', '25/06', 3),
        ('8.0.0-II', '29/05', 2),
        ('9.0.0-III', '15/07', 2),
    ],
    'SISTEMA-CONTRATOS-SEDUR': [
        ('2.0.0-Corr', '11/06', 3),
        ('4.0.0', '26/11', 1),
        ('5.0.0', '19/11', 2),
        ('6.0.0', '24/11', 1),
    ],
    'SMED-MAE': [
        ('Sprint1', '06/01', 3),
        ('Sprint2', '06/01', 4),
        ('Sprint3', '21/02', 2),
        ('Sprint4', '17/04', 2),
    ],
}

# Processar dados e agrupar por mês e projeto
ciclos_por_mes_projeto = defaultdict(lambda: defaultdict(int))

for projeto, versoes in dados_projetos.items():
    for versao, data_inicio, num_ciclos in versoes:
        mes = extrair_mes_de_data(data_inicio)
        if mes and mes <= 11:  # Excluir dezembro
            mes_nome = MESES[mes]
            ciclos_por_mes_projeto[mes_nome][projeto] += num_ciclos

# Gerar CSV
with open('/home/ubuntu/Retrospectiva-QA/client/public/ciclos_por_projeto_mes.csv', 'w', newline='', encoding='utf-8') as f:
    # Coletar todos os projetos únicos
    todos_projetos = set()
    for projetos_mes in ciclos_por_mes_projeto.values():
        todos_projetos.update(projetos_mes.keys())
    
    projetos_ordenados = sorted(todos_projetos)
    
    # Escrever cabeçalho
    writer = csv.writer(f)
    writer.writerow(['Mes'] + projetos_ordenados)
    
    # Escrever dados por mês (Janeiro a Novembro)
    for mes_num in range(1, 12):
        mes_nome = MESES[mes_num]
        linha = [mes_nome]
        for projeto in projetos_ordenados:
            ciclos = ciclos_por_mes_projeto[mes_nome].get(projeto, 0)
            linha.append(ciclos)
        writer.writerow(linha)

print("CSV gerado com sucesso: client/public/ciclos_por_projeto_mes.csv")
print(f"Total de projetos: {len(projetos_ordenados)}")
print(f"Projetos: {', '.join(projetos_ordenados)}")
