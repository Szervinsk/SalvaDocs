def refina_dados(dados):
    titulo = f"Análise do Programa de Integridade da empresa {dados['empresa']}, referente ao Contrato nº {dados['contrato']}."
    valor = dados['valor']
    data = dados['data']
    resumo_texto = f"Reduza a um parágrafo o texto: \"{dados['resumo']}\""
    return {
        "empresa": dados['empresa'],
        "contrato": 'CT nº ' + dados['contrato'],
        "data": data,
        "valor": valor,
        "titulo": titulo,
        "documentos": dados.get('documentos', ['Não informado']),
        "Números de Despacho": dados.get('despacho', ['Não informado']),
        "Números SEI": dados.get('sei', ['Não informado']),
        "resumo": resumo_texto
    }
