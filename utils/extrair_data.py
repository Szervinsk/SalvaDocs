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
    
    # ARP (Ata de Registro de Preços)
    m = re.search(r'(?:ARP|Ata de Registro de Preços)\s*n[º°]?\s*(\d+/\d{4})', texto, re.IGNORECASE)
    dados['arp'] = m.group(1) if m else 'Não informado'
    
    # Decisão
    m = re.search(r'Decisão\s*n[º°]?\s*(\d+/\d{4})', texto, re.IGNORECASE)
    dados['decisao'] = m.group(1) if m else 'Não informado'

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
    m = re.search(r'Brasília(?:-DF)?(?:,)?\s*(\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4})', texto, re.IGNORECASE)
    dados['data'] = m.group(1).strip() if m else 'Não informado'

    # 2. Número do parecer
    m = re.search(r'PARECER\s*(?:n[º°]?\s*)?([\d/]+-[A-Z]+)?', texto, re.IGNORECASE)
    dados['parecer'] = m.group(1).strip() if m and m.group(1) else 'Não informado'

    # 3. Interessados
    m = re.search(r'INTERESSADO\(S\):\s*(.+?)(?:\n|$)', texto, re.IGNORECASE)
    dados['interessados'] = m.group(1).strip() if m else 'Não informado'

    # 1. Histórico (até 7 linhas ou fim do primeiro parágrafo)
    historico_match = re.search(
        r'(?:1\.\s*)?Histórico\s*\n+(.*?)(?:\n{2,}|\n+Por último|\n+Seguindo o rito|\n+2\.\s*Análise)', 
        texto, re.DOTALL | re.IGNORECASE
    )

    if historico_match:
        historico_texto = historico_match.group(1).strip()
        linhas = historico_texto.split('\n')
        historico_resumo = '\n'.join(linhas[:7])
        dados['historico_inicial'] = historico_resumo.replace('\n', ' ').strip()
    else:
        dados['historico_inicial'] = 'Não informado'

    texto_para_conclusao = re.sub(
    r'Identificador do item arquivístico.*?horário oficial de.*?\n+', 
    '', texto, flags=re.DOTALL | re.IGNORECASE
    )

    # 3. Conclusão (até Brasília ou Atenciosamente)
    conclusao_match = re.search(
        r'(?:3\.\s*)?Conclusão\s*\n+(.*?)(?:\n+Brasília|\n+Atenciosamente)',
        texto_para_conclusao, re.DOTALL | re.IGNORECASE
    )

    dados['conclusao'] = (
        conclusao_match.group(1).strip().replace('\n', ' ') 
        if conclusao_match else 'Não informado'
    )

    # 3. Resumo final com ambos
    dados['resumo'] = f"{dados['historico_inicial']}.{dados['conclusao']}"

    # 6. Despachos
    despachos = re.findall(r'(?:Despacho|id\.)\s*\(?(\d+)\)?', texto, re.IGNORECASE)
    dados['despacho'] = list(set(despachos)) if despachos else ['Não informado']

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
    m = re.search(r'\b(?:SEI|NUP)\s*(\d{5}-\d{8}/\d{4}-\d{2})', texto)
    dados['sei'] = m.group(1) if m else 'Não informado'

    # 11. GDOC
    m = re.search(r'\b(?:GDOC|Doc. Id.)\s*n[º°]?\s*(\d+/\d{4}|\d+)', texto, re.IGNORECASE)
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

import re

def extrair_despacho(texto):
    dados = {}

    # 1. Data (última do documento)
    # 1. Data (após "Brasília" ou "Brasília-DF")
    m = re.search(r'Brasília(?:-DF)?(?:,)?\s*(\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4})', texto, re.IGNORECASE)
    dados['data'] = m.group(1).strip() if m else 'Não informado'


    # 2. Destinatário (pode estar como "Para: ..." ou "À ... ,")
    m = re.search(r'(?:Para|À)\s*[:\-]?\s*(.+?)[,;\n]', texto, re.IGNORECASE)
    dados['destinatario'] = m.group(1).strip() if m else 'Não informado'

    # 3. Corpo do despacho: trecho após "Assunto: ...,", "À ... ," ou "Para: ...", até "Atenciosamente", "Brasília" ou parágrafo final
    m = re.search(
        r'(?:Assunto\s*[:\-]?\s*.+?|(?:Para|À)\s*[:\-]?\s*.+?)[,;\n]+\s*(.*?)(?:\n+Atenciosamente|\n+Brasília|\n\n)',
        texto,
        re.DOTALL | re.IGNORECASE
    )
    dados['corpo_despacho'] = m.group(1).strip().replace('\n', ' ') if m else 'Não informado'

    # 4. Número SEI ou NUP
    m = re.search(r'\b(?:SEI|NUP)\s*(\d{5}-\d{8}/\d{4}-\d{2})', texto)
    dados['sei'] = m.group(1) if m else 'Não informado'

    # 5. Número do despacho
    m = re.search(r'\b(?:GDOC|Doc\. Id\.|Doc\. SEI(?:/GDF)?)\s*(?:n[º°]?\s*)?(\d{6,}|\d+/\d{4})', texto, re.IGNORECASE)
    dados['despacho'] = m.group(1) if m else 'Não informado'

    # 6. Assunto
    m = re.search(r'Assunto\s*[:\-]?\s*(.+?)(?:\n|$)', texto, re.IGNORECASE)
    dados['assunto'] = m.group(1).strip() if m else 'Não informado'

    # 7. Documento principal + número (ex: Decisão nº 2331/2025)
    doc_match = re.search(
        r'(Decisão|Decreto|Lei|Portaria|Relatório de Auditoria|Nota de Auditoria|Despacho Singular)\s*n[º°]?\s*\d+/\d{4}',
        texto,
        re.IGNORECASE
    )
    dados['documento_principal'] = doc_match.group(0) if doc_match else 'Não informado'

    return dados
