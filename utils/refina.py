def refina_dados(dados, tipo_servico=None):
    """Função principal que refina os dados conforme o tipo de serviço"""
    if tipo_servico == 'parecer':
        return refina_parecer(dados)
    elif tipo_servico == 'despachos':
        return refina_despacho(dados)
    else:  # programas de integridade por padrão
        return refina_programas(dados)

def refina_parecer(dados):
    """Refina dados para documentos do tipo Parecer"""
    resposta = {}
    
    # Determina o título com base no tipo de documento
    if dados.get('tipo_documento') == 'Política':
        resposta['titulo'] = f"Análise da {dados.get('codigo_documento', [''])[0]} - {dados.get('nome_documento', '')}"
    elif dados.get('tipo_documento') == 'Norma':
        resposta['titulo'] = f"Revisão da {dados.get('codigo_documento', [''])[0]} - {dados.get('nome_documento', '')}"
    elif dados.get('tipo_documento') == 'Regimento':
        resposta['titulo'] = f"Avaliação do {dados.get('codigo_documento', [''])[0]} - {dados.get('nome_documento', '')}"
    else:
        resposta['titulo'] = "Análise documental"
    
    # Adiciona informações básicas
    resposta['data'] = dados.get('data', 'Não informado')
    resposta['parecer'] = dados.get('parecer', 'Não informado')
    
    # Adiciona informações específicas
    campos = ['interessados', 'tipo_documento', 'codigo_documento', 'nome_documento']
    
    for campo in campos:
        if dados.get(campo):
            # Formata o nome do campo para exibição
            nome_campo = campo.replace('_', ' ').title()
            resposta[nome_campo] = dados[campo]
    
    # Processa NUP/SEI (tratados como a mesma coisa)
    identificador = dados.get('sei') or dados.get('sei', ['Não informado'])
    resposta['SEI'] = identificador[0] if isinstance(identificador, list) and len(identificador) > 0 else identificador
    
    # Processa Despacho/GDOC (tratados como a mesma coisa)
    referencia = dados.get('gdoc') or dados.get('gdoc', ['Não informado'])
    resposta['gdoc'] = referencia[0] if isinstance(referencia, list) and len(referencia) > 0 else referencia
    
    # Extrai apenas o primeiro parágrafo após "Histórico" se existir
    if dados.get('resumo'):
        # Pega apenas o primeiro parágrafo (até a primeira quebra de linha dupla)
        historico_resumido = f'A seguir está um texto de parecer administrativo que deve ser resumido em um único parágrafo claro, objetivo e formal. Texto a resumir: {dados['resumo'].split('\n\n')[0]}'
        resposta['Contexto'] = historico_resumido.strip()
    
    return resposta

def refina_programas(dados):
    """Refina dados para Programas de Integridade"""
    resposta = {}

    # Título adaptativo
    if dados.get('empresa') and dados.get('contrato'):
        resposta['empresa'] = dados['empresa']
        resposta['contrato'] = 'CT nº ' + dados['contrato']
        resposta['decisao'] = dados['decisao']
        resposta['titulo'] = f"Análise do Programa de Integridade da empresa {dados['empresa']}, referente ao Contrato nº {dados['contrato']}."
    else:
        resposta['titulo'] = "Análise de Programa de Integridade"
    
    # Informações básicas
    resposta['data'] = dados.get('data', 'Não informado')

    # Valor (caso exista)
    if dados.get('valor'):
        resposta['valor'] = dados['valor']

    # Documentos relacionados
    resposta['documentos'] = dados.get('documentos', ['Não informado'])

    # Processos SEI/Despachos
    sei = dados.get('sei') or ([dados['nup']] if dados.get('nup') else ['Não informado'])
    resposta['SEI'] = sei[0] if isinstance(sei, list) and len(sei) > 0 else sei
    
    despacho = dados.get('despacho') or ([dados['gdoc']] if dados.get('gdoc') else ['Não informado'])
    resposta['despacho'] = despacho[0] if isinstance(despacho, list) and len(despacho) > 0 else despacho

    # Resumo (se existir)
    if dados.get('resumo'):
        resposta['resumo'] = f"Reduza a um parágrafo o seguinte texto: {dados['resumo']}"

    return resposta

def refina_despacho(dados):
    """Refina dados para documentos do tipo Despacho"""
    resposta = {}

    # Título e identificação
    resposta['Gdoc'] = f"{dados.get('despacho', 'Não informado')}"
    resposta['data'] = dados.get('data', 'Não informado')
    resposta['assunto'] = dados.get('assunto', 'Não informado')
    resposta['documento_principal'] = dados.get('documento_principal', 'Não informado')

    # Identificadores
    sei = dados.get('sei')
    resposta['SEI'] = sei[0] if isinstance(sei, list) and sei else sei or 'Não informado'

    # Corpo do despacho como resumo
    if dados.get('corpo_despacho'):
        resposta['resumo'] = f"""A seguir está um texto de despacho administrativo que deve ser resumido em um único parágrafo claro, objetivo e formal. Em seguida, gere um título sugestivo para o despacho, mencionando o documento principal citado nele. Texto para resumir: {dados['corpo_despacho']}"""

    # Destinatário
    if dados.get('destinatario'):
        resposta['destinatario'] = dados['destinatario']

    return resposta
