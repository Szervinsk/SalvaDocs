from transformers import pipeline
import re

# === 1. SUMARIZADOR ===
summarizer = pipeline("summarization", model="unicamp-dl/ptt5-base-portuguese-vocab")

def resumir_texto(texto):
    entrada = "resuma: " + texto
    resultado = summarizer(entrada, max_length=120, min_length=30, do_sample=False, truncation=True)
    return resultado[0]['summary_text']

# === 2. EXTRATOR DE INFORMAÇÕES ===
def extrair_info(texto):
    info = {}

    # Número do processo (ex: 12345.678.2022.1.00.0000)
    processo = re.findall(r'\d{5}\.\d{3}\.\d{4}\.\d\.\d{2}\.\d{4}', texto)
    if processo:
        info['processo'] = processo[0]

    # Data (ex: 21 de julho de 2025 ou 21/07/2025)
    data = re.findall(r'\d{1,2}/\d{1,2}/\d{4}|\d{1,2} de [a-zç]+ de \d{4}', texto, re.IGNORECASE)
    if data:
        info['data'] = data[0]

    # Título (assumimos que pode estar em maiúsculas no início)
    linhas = texto.split('\n')
    possivel_titulo = [l for l in linhas if l.isupper() and len(l.strip()) > 10]
    if possivel_titulo:
        info['titulo'] = possivel_titulo[0].strip()

    # Documentos mencionados (ex: Lei nº 8.112/1990, Portaria nº 123, etc)
    documentos = re.findall(r'(Lei|Portaria|Decreto|Resolução)[^\n,.]+', texto, re.IGNORECASE)
    if documentos:
        info['documentos'] = list(set(documentos))  # remove duplicatas

    return info

# === 3. EXEMPLO DE USO ===
texto_exemplo = """
PORTARIA Nº 123, DE 15 DE JUNHO DE 2023

Estabelece diretrizes para as parcerias com organizações da sociedade civil conforme a Lei nº 13.204, de 2015. 
Processo nº 00000.123.2023.1.00.0000. A colaboração terá início em 21/07/2025. 
"""

resumo = resumir_texto(texto_exemplo)
info = extrair_info(texto_exemplo)

print("Resumo:", resumo)
print("Informações extraídas:", info)
