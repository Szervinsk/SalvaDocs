import re

def extrair_dados(texto):
    dados = {}

    # Data
    m = re.search(r'\d{1,2} de [a-zç]+ de \d{4}', texto, re.IGNORECASE)
    if m:
        dados['data'] = m.group(0)

    # Assunto / título
    m = re.search(r'Assunto:\s*(.+)', texto)
    if m:
        dados['assunto'] = m.group(1).strip()

    # Captura o parágrafo após o Assunto até "Atenciosamente"
    m = re.search(r'Assunto:.*?\n(.*?)\nAtenciosamente', texto, re.DOTALL | re.IGNORECASE)
    if m:
        resumo = m.group(1).strip()
        dados['resumo'] = resumo

    # Nome da empresa
    m = re.search(r'empresa\s+(.+?),', texto, re.IGNORECASE)
    if m:
        dados['empresa'] = m.group(1).strip()

    # Número do contrato
    m = re.search(r'Contrato\s*(\d+/\d{4})', texto)
    if m:
        dados['contrato'] = m.group(1)

    # Valor do contrato
    m = re.search(r'R\$ [\d\.,]+', texto, re.IGNORECASE)
    if m:
        dados['valor'] = m.group(0)

    # Processos completos
    processos = []
    processos += re.findall(r'(Despacho\s*\d+)', texto)
    processos += re.findall(r'(SEI\s*[\d\-\/]+)', texto)
    seen = set()
    processos_limpos = []
    for p in processos:
        if p not in seen:
            seen.add(p)
            processos_limpos.append(p)
    dados['processos'] = processos_limpos

    return dados