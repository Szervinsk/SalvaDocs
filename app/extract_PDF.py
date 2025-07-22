import fitz  # pymupdf
import os

from app.extrair_data import extrair_dados
from app.refina import refina_dados

def processar_pdfs():
    pasta = 'app/files/'

    if not os.path.exists(pasta):
        print(f"[ERRO] Pasta '{pasta}' não encontrada. Caminho atual: {os.getcwd()}")
        return

    arquivos = [f for f in os.listdir(pasta) if f.lower().endswith('.pdf')]

    for nome_arquivo in arquivos:
        caminho = os.path.join(pasta, nome_arquivo)
        print(f'>>> Processando: {nome_arquivo}')

        texto = ''
        with fitz.open(caminho) as doc:
            for pagina in doc:
                texto += pagina.get_text()

        dados = extrair_dados(texto)

        if all(k in dados for k in ['empresa', 'contrato', 'data', 'valor', 'resumo']):
            refina_dados(dados)
        else:
            print(f'[!] Dados incompletos para: {nome_arquivo}\n')
