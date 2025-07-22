from app.resumir_texto import resumo_geral

def refina_dados(dados):
    titulo = f"Análise do Programa de Integridade da Empresa {dados['empresa']}, atinente ao Contrato {dados['contrato']}."
    valor = f"{dados['valor']}"
    data = f"{dados['data']}"
    processos = f"{dados['processos']}"
    # resumo = f"Reduza a um parágrafo o texto: \"{dados['resumo']}\""
    resumo = resumo_geral(dados['resumo'])

    print('\n=========================')
    print('Processos:', processos)
    print('CT nº', dados['contrato'])
    print('Data:', data)
    print('Título:', titulo)
    print('Empresa:', dados['empresa'])
    print('Valor:', valor)
    print('Resumo:', resumo)
    print('=========================\n')