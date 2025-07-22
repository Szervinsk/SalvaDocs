from app.resumir_texto import resumo_geral
import re

def refina_dados(dados):
    titulo = f"Análise do Programa de Integridade da empresa {dados['empresa']}, referente ao Contrato nº {dados['contrato']}."
    valor = dados['valor']
    data = dados['data']
    processos = ', '.join(dados['processos']) if isinstance(dados['processos'], list) else dados['processos']
    
    # 🔍 Refinar documentos com tipo, número e referência
    documentos_brutos = dados.get('documentos', [])
    documentos_formatados = []
    for doc in documentos_brutos:
        m = re.search(
            r'(Lei|Portaria|Decreto|Resolução|Decisão|Relatório)[^\d\n,.]*[nº°]?\s*\d{1,4}(?:/\d{4})?(?:\s*\([\d]+\))?',
            doc,
            re.IGNORECASE
        )
        if m:
            documentos_formatados.append(m.group(0).strip())
    documentos_final = ', '.join(set(documentos_formatados)) if documentos_formatados else 'Não informado'

    resumo_texto = f"Reduza a um parágrafo o texto: \"{dados['resumo']}\""
    # resumo_texto = resumo_geral(dados['resumo'])  # descomente se quiser resumir automaticamente

    print("\n" + "=" * 50)
    print(f"{'🏢 Empresa:':15} {dados['empresa']}")
    print(f"{'📄 Contrato:':15} {dados['contrato']}")
    print(f"{'📆 Data:':15} {data}")
    print(f"{'💰 Valor:':15} {valor}")
    print(f"{'📚 Documentos:':15} {documentos_final}")
    print(f"{'🔗 Processos:':15} {processos}")
    print("\n📝 Título:\n" + titulo)
    print("\n📌 Resumo:\n" + resumo_texto)
    print("=" * 50 + "\n")