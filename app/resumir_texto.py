from transformers import T5Tokenizer, T5ForConditionalGeneration

# Modelo treinado para sumarização em português jurídico/administrativo
model_name = "stjiris/t5-portuguese-legal-summarization"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

def resumir_texto(texto):
    entrada = "resuma: " + texto.strip().replace("\n", " ")
    inputs = tokenizer.encode(entrada, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(
        inputs,
        max_length=120,
        min_length=20,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    resumo = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return resumo

def truncar_texto(texto, max_chars=1500):
    if len(texto) > max_chars:
        return texto[:max_chars]
    return texto

def dividir_em_blocos(texto, tamanho_max=1500):
    blocos = []
    start = 0
    while start < len(texto):
        fim = start + tamanho_max
        blocos.append(texto[start:fim])
        start = fim
    return blocos

def resumo_geral(texto):
    blocos = dividir_em_blocos(texto, tamanho_max=1500)
    resumos = []
    for i, bloco in enumerate(blocos):
        print(f"Resumindo bloco {i+1}/{len(blocos)}...")
        resumos.append(resumir_texto(bloco))
    texto_resumo_final = " ".join(resumos)
    print("Resumindo a concatenação dos resumos dos blocos...")
    resumo_final = resumir_texto(texto_resumo_final)
    return resumo_final