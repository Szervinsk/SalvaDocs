import re

def extrair_dados(texto):
    dados = {}

    # Data
    m = re.search(r'\d{1,2} de [a-zç]+ de \d{4}', texto, re.IGNORECASE)
    dados['data'] = m.group(0) if m else 'Não informado'

    # Assunto / título
    m = re.search(r'Assunto:\s*(.+)', texto)
    dados['assunto'] = m.group(1).strip() if m else 'Não informado'

    # Resumo
    m = re.search(r'Assunto:.*?\n(.*?)\nAtenciosamente', texto, re.DOTALL | re.IGNORECASE)
    dados['resumo'] = m.group(1).strip() if m else 'Não informado'

    # Empresa
    m = re.search(r'empresa\s+([^\.,\n]+)', texto, re.IGNORECASE)
    dados['empresa'] = m.group(1).strip() if m else 'Não informado'

    # Contrato
    m = re.search(r'contrato\s*n[ºº]?\s*(\d+/\d{4})', texto, re.IGNORECASE)
    dados['contrato'] = m.group(1) if m else 'Não informado'

    # Valor
    m = re.search(r'R\$[\s]*[\d\.,]+', texto, re.IGNORECASE)
    dados['valor'] = m.group(0).strip() if m else 'Não informado'

    # Documentos
    documentos = re.findall(
    r'(Lei|Portaria|Portaria CGDF|Decreto|Resolução|Decisão|Relatório)[^\d\n,.]*[nº°]?\s*\d{1,4}(?:/\d{4})?(?:\s*\([\d]+\))?',
    texto,
    re.IGNORECASE
    )
    dados['documentos'] = list(set(documentos)) if documentos else ['Não informado']

    # Processos
    processos = re.findall(r'(Despacho\s*\d+|SEI\s*[\d\-\/]+)', texto)
    dados['processos'] = list(set(processos)) if processos else ['Não informado']

    return dados