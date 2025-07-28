import fitz  # PyMuPDF

def processar_pdfs(caminho):
    """
    Lê o conteúdo de um arquivo PDF salvo em disco e retorna seu texto.
    """
    print(f'>>> Processando: {caminho}')

    texto = ''
    try:
        with fitz.open(caminho) as doc:
            for pagina in doc:
                texto += pagina.get_text()
    except Exception as e:
        print(f'[!] Erro ao ler o PDF: {e}')
        return ''

    if not texto.strip():
        print(f'[!] Nenhum texto encontrado no arquivo: {caminho}')

    return texto
