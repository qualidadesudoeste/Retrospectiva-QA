import csv
import re

def padronizar_sprint(sprint_nome):
    """
    Padroniza nome da sprint:
    - "Sprint 1" -> "1"
    - "2.0.0" -> "2"
    - "2.0.3" -> "2.3"
    - "10.0.0 PWA" -> "10"
    - "2.0.0 Corretiva" -> "2"
    - "Sprint 6.1" -> "6.1"
    """
    # Extrair apenas números e pontos
    numeros = re.findall(r'\d+\.?\d*', sprint_nome)
    if not numeros:
        return sprint_nome
    
    # Pegar o primeiro número encontrado
    numero = numeros[0]
    
    # Converter para float e depois formatar
    try:
        valor = float(numero)
        # Se for inteiro, retornar sem decimal
        if valor == int(valor):
            return str(int(valor))
        else:
            # Se tiver decimal, retornar com 1 casa decimal
            return f"{valor:.1f}".rstrip('0').rstrip('.')
    except:
        return numero

# Ler CSV
with open('client/public/ciclos_por_sprint.csv', 'r') as f:
    reader = csv.reader(f)
    linhas = list(reader)

# Processar cada linha
for i, linha in enumerate(linhas):
    if len(linha) >= 2:
        # Coluna 1 é o nome da sprint
        sprint_original = linha[1]
        sprint_padronizado = padronizar_sprint(sprint_original)
        linhas[i][1] = sprint_padronizado
        if sprint_original != sprint_padronizado:
            print(f"{linha[0]}: '{sprint_original}' -> '{sprint_padronizado}'")

# Escrever de volta
with open('client/public/ciclos_por_sprint.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(linhas)

print("\nPadronização concluída!")
