import fitz  # PyMuPDF
from io import BytesIO

def processar_pdfs(arquivo):
    """
    Lê o conteúdo de um arquivo PDF enviado pelo Flask e retorna seu texto.
    """
    nome_arquivo = getattr(arquivo, 'filename', 'arquivo.pdf')
    print(f'>>> Processando: {nome_arquivo}')

    texto = ''
    try:
        buffer = BytesIO(arquivo.read())  # arquivo vem como FileStorage
        with fitz.open(stream=buffer, filetype='pdf') as doc:
            for pagina in doc:
                texto += pagina.get_text()
    except Exception as e:
        print(f'[!] Erro ao ler o PDF: {e}')
        return ''

    if not texto.strip():
        print(f'[!] Nenhum texto encontrado no arquivo: {nome_arquivo}')

    return texto
