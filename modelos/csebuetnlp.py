from transformers import MT5Tokenizer, MT5ForConditionalGeneration

model_name = "csebuetnlp/mT5_multilingual_XLSum"
tokenizer = MT5Tokenizer.from_pretrained(model_name)
model = MT5ForConditionalGeneration.from_pretrained(model_name)

def resumir(texto):
    entrada = f"summarize: {texto}"
    inputs = tokenizer.encode(entrada, return_tensors="pt", max_length=512, truncation=True)
    output = model.generate(
        inputs,
        min_length=40,
        max_length=100,
        num_beams=4,
        length_penalty=1.2,
        early_stopping=True
    )
    return tokenizer.decode(output[0], skip_special_tokens=True)

texto = """
trata-se da documentação enviada pela Diretoria de Comércio (DP), sobre o programa de integridade da empresa Junior, atinente ao Contrato nº 101010/2025 no qual aborda sobre procedimentos de segurança e proteção de veículos automáticos. Nesse sentido, cumpre-nos relatar que essa unidade de controle fornece o relatório de atividades e direções encaminhados pela Controladoria Geral do Distrito Federal (CGDF) sobre o cumprimento da lei nº 8023/2024. Por fim, foram incluidos a lista de verificação, o contrato, programa de integridade e demais documentacoes.
"""

print("Resumo:\n", resumir(texto))

# from transformers import MT5Tokenizer, MT5ForConditionalGeneration


# # usado para resumos mais tranquilos
# model_name = "csebuetnlp/mT5_multilingual_XLSum"
# tokenizer = MT5Tokenizer.from_pretrained(model_name)
# model = MT5ForConditionalGeneration.from_pretrained(model_name)

# def resumir_texto(texto):
#     entrada = f"resuma o seguinte texto: {texto}" 
#     inputs = tokenizer.encode(entrada, return_tensors="pt", max_length=512, truncation=True)
#     resumo_ids = model.generate(
#         inputs,
#         min_length=80,            # aumenta o tamanho mínimo
#         max_length=200,           # aumenta o tamanho máximo
#         num_beams=4,
#         no_repeat_ngram_size=2,
#         repetition_penalty=2.5,
#         length_penalty=1.2,       # favorece saídas mais longas (>1.0)
#         early_stopping=True
#     )
#     return tokenizer.decode(resumo_ids[0], skip_special_tokens=True)

# # texto = """
# # Este é um exemplo de texto mais longo para testar a capacidade do modelo T5 em realizar a tarefa de resumo automático.
# # A ideia é verificar se o modelo consegue extrair as informações mais importantes de um parágrafo extenso, mantendo o significado geral.
# # Com o avanço dos modelos de linguagem natural, ferramentas como essa podem auxiliar estudantes, pesquisadores e profissionais a compreenderem rapidamente grandes volumes de texto.
# # Esta aplicação busca usar modelos gratuitos, sem depender de APIs pagas, facilitando o acesso a tecnologias de NLP.
# # """

# texto = """
# trata-se da documentação enviada pela Diretoria de Comércio (DP), sobre o programa de integridade da empresa Junior, atinente ao Contrato nº 101010/2025 no qual aborda sobre procedimentos de segurança e proteção de veículos automáticos. Nesse sentido, cumpre-nos relatar que essa unidade de controle fornece o relatório de atividades e direções encaminhados pela Controladoria Geral do Distrito Federal (CGDF) sobre o cumprimento da lei nº 8023/2024. Por fim, foram incluidos a lista de verificação, o contrato, programa de integridade e demais documentacoes.
# """

# """
# O Departamento de Comércio do Distrito Federal (DDF) divulgou nesta quarta-feira um relatório sobre o programa de integridade da empresa Junior, que controla veículos automáticos no Brasil. A nota foi enviada pelo Ministério das Relações Exteriores para acompanhar a implementação do contrato entre esta empresa e as autoridades federais.
# """

# print("Resumo:", resumir_texto(texto))
