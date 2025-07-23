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
    m = re.search(r'contrato\s*n[º°]?\s*(\d+/\d{4})', texto, re.IGNORECASE)
    dados['contrato'] = m.group(1) if m else 'Não informado'

    # Valor
    m = re.search(r'R\$[\s]*[\d\.,]+', texto, re.IGNORECASE)
    dados['valor'] = m.group(0).strip() if m else 'Não informado'

    # Documentos (ex: Lei 1234/2022)
    documentos = re.findall(
        r'(Lei|Portaria CGDF|Portaria|Decreto|Resolução|Decisão|Relatório)',
        texto,
        re.IGNORECASE
    )
    dados['documentos'] = list(set(documentos)) if documentos else ['Não informado']

    # Processos separados: Despacho e SEI
    despachos = re.findall(r'Despacho\s*(\d+)', texto, re.IGNORECASE)
    seis = re.findall(r'SEI\s*(\d{5}-\d{8}/\d{4}-\d{2})', texto)

    dados['despacho'] = list(set(despachos)) if despachos else ['Não informado']
    dados['sei'] = list(set(seis)) if seis else ['Não informado']

    return dados

def extrair_parecer(texto):
    dados = {}

    # 1. Data (última do documento)
    datas = re.findall(r'\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4}', texto, re.IGNORECASE)
    dados['data'] = datas[-1] if datas else 'Não informado'

    # 2. Número do parecer
    m = re.search(r'PARECER\s*(?:n[º°]?\s*)?([\d/]+-[A-Z]+)?', texto, re.IGNORECASE)
    dados['parecer'] = m.group(1).strip() if m and m.group(1) else 'Não informado'

    # 3. Interessados
    m = re.search(r'INTERESSADO\(S\):\s*(.+?)(?:\n|$)', texto, re.IGNORECASE)
    dados['interessados'] = m.group(1).strip() if m else 'Não informado'

    # # 4. Histórico inicial
    # historico = re.search(r'(?:1\.\s*)?Histórico\s*\n+(.*?)(?:\n{2,}|Por último|Seguindo o rito|2\.\s*Análise)', 
    #                      texto, re.DOTALL | re.IGNORECASE)
    # dados['historico_inicial'] = historico.group(1).strip().replace('\n', ' ') if historico else 'Não informado'

    # 5. Conclusão
    conclusao = re.search(r'(?:3\.\s*)?Conclusão\s*\n+(.*?)(?:\n+Brasília|\n+\d{1,2}\s+de\s+[a-zç]+|\n+À)', 
                          texto, re.DOTALL | re.IGNORECASE)
    dados['conclusao'] = conclusao.group(1).strip().replace('\n', ' ') if conclusao else 'Não informado'

    # 6. Despachos
    despachos = re.findall(r'(?:Despacho|id\.)\s*\(?(\d+)\)?', texto, re.IGNORECASE)
    dados['despacho'] = list(set(despachos)) if despachos else ['Não informado']

    # 7. SEIs
    seis = re.findall(r'\bSEI\s*(\d{5}-\d{8}/\d{4}-\d{2})', texto)
    dados['sei'] = list(set(seis)) if seis else ['Não informado']

    # 8. Código da política/norma/regimento
    politicas = re.findall(r'\b(?:PL|NR|RG|ND)[\.-]?[A-Z]{0,3}[-\w]+', texto)
    dados['codigo_documento'] = list(set(politicas)) if politicas else ['Não informado']

    # 9. Nome do documento
    # Primeiro tenta pegar após ASSUNTO
    m = re.search(r'ASSUNTO:\s*(.+?)(?:\n|$)', texto, re.IGNORECASE)
    assunto = m.group(1).strip() if m else ''
    
    # Se não encontrar, procura por padrões de nome
    if not assunto or len(assunto) < 5:  # Se muito curto, não é um nome válido
        nome_match = re.search(r'(Política|Norma|Regimento)\s+(?:de|da|do)?\s*([A-ZÁ-Úa-zá-ú\s\-]+)', texto, re.IGNORECASE)
        if nome_match:
            assunto = f"{nome_match.group(1)} de {nome_match.group(2).strip()}"
    
    dados['nome_documento'] = assunto if assunto else 'Não informado'

    # 10. Referência NUP
    m = re.search(r'NUP\s+(\d{5}-\d{8}/\d{4}-\d{2})', texto)
    dados['nup'] = m.group(1) if m else 'Não informado'

    # 11. GDOC
    m = re.search(r'GDOC\s*[nº°]?\s*(\d+)', texto, re.IGNORECASE)
    dados['gdoc'] = m.group(1) if m else 'Não informado'

    # 12. Tipo de documento (Política, Norma, Regimento)
    tipo = 'Outros'
    if re.search(r'\bPolítica\b', texto, re.IGNORECASE):
        tipo = 'Política'
    elif re.search(r'\bNorma\b', texto, re.IGNORECASE):
        tipo = 'Norma'
    elif re.search(r'\bRegimento\b', texto, re.IGNORECASE):
        tipo = 'Regimento'
    dados['tipo_documento'] = tipo

    return dados