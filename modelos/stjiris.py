from transformers import T5Tokenizer, T5ForConditionalGeneration

# Modelo jurídico já treinado para sumarização
model_name = "stjiris/t5-portuguese-legal-summarization"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

def resumir_documento_juridico(texto, max_tokens=150):
    entrada = f"resuma o seguinte texto: {texto}"
    inputs = tokenizer.encode(entrada, return_tensors="pt", max_length=512, truncation=True)

    resumo_ids = model.generate(
        inputs,
        max_length=60,             # mais curto
        min_length=30,
        num_beams=4,
        length_penalty=2.0,        # força o modelo a resumir
        no_repeat_ngram_size=3,
        repetition_penalty=2.5,
        early_stopping=True
    )

    resumo = tokenizer.decode(resumo_ids[0], skip_special_tokens=True)
    return resumo

# Exemplo de texto jurídico real
texto_juridico = """
trata-se da documentação enviada pela Diretoria de Comércio (DP), sobre o programa de integridade da empresa Junior, atinente ao Contrato nº 101010/2025 no qual aborda sobre procedimentos de segurança e proteção de veículos automáticos. Nesse sentido, cumpre-nos relatar que essa unidade de controle fornece o relatório de atividades e direções encaminhados pela Controladoria Geral do Distrito Federal (CGDF) sobre o cumprimento da lei nº 8023/2024. Por fim, foram incluidos a lista de verificação, o contrato, programa de integridade e demais documentacoes.
"""

# Gera e exibe o resumo
resumo = resumir_documento_juridico(texto_juridico)
print("📄 Resumo jurídico:\n", resumo)
