import fitz  # PyMuPDF
from io import BytesIO

from utils.extrair_data import extrair_dados
from utils.refina import refina_dados

def processar_pdfs(arquivo):
    nome_arquivo = getattr(arquivo, 'filename', 'arquivo.pdf')
    print(f'>>> Processando: {nome_arquivo}')

    texto = ''
    try:
        buffer = BytesIO(arquivo.read())  # arquivo vem como FileStorage no Flask
        with fitz.open(stream=buffer, filetype='pdf') as doc:
            for pagina in doc:
                texto += pagina.get_text()
    except Exception as e:
        print(f'[!] Erro ao ler o PDF: {e}')
        return ''

    dados = extrair_dados(texto)

    campos_obrigatorios = ['empresa', 'contrato', 'data', 'valor', 'resumo']
    if all(k in dados and dados[k] != 'Não informado' for k in campos_obrigatorios):
        refina_dados(dados)
    else:
        print(f'[!] Dados incompletos para: {nome_arquivo}\nCampos ausentes ou inválidos:', 
              [k for k in campos_obrigatorios if dados.get(k) == 'Não informado'])

    return texto  # opcional: retornar conteúdo para outras operações