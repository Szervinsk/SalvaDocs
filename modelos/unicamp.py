from transformers import T5Tokenizer, T5ForConditionalGeneration

# Modelo treinado em português
model_name = "unicamp-dl/ptt5-base-portuguese-vocab"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

def resumir_texto(texto):
    entrada = f"resuma o seguinte texto: {texto}"
    inputs = tokenizer.encode(entrada, return_tensors="pt", max_length=512, truncation=True)
    resumo_ids = model.generate(inputs, max_length=150, num_beams=4, early_stopping=True)
    return tokenizer.decode(resumo_ids[0], skip_special_tokens=True)

# Texto mais longo para teste
texto = """
Este é um exemplo de texto mais longo para testar a capacidade do modelo T5 em realizar a tarefa de resumo automático.
A ideia é verificar se o modelo consegue extrair as informações mais importantes de um parágrafo extenso, mantendo o significado geral.
Com o avanço dos modelos de linguagem natural, ferramentas como essa podem auxiliar estudantes, pesquisadores e profissionais a compreenderem rapidamente grandes volumes de texto.
Esta aplicação busca usar modelos gratuitos, sem depender de APIs pagas, facilitando o acesso a tecnologias de NLP.
"""

resumo = resumir_texto(texto)
print("Resumo:", resumo)
