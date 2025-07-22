from transformers import MT5Tokenizer, MT5ForConditionalGeneration

model = MT5ForConditionalGeneration.from_pretrained("../treinamento/mt5_finetuned")
tokenizer = MT5Tokenizer.from_pretrained("../treinamento/mt5_finetuned")

def resumir(texto):
    entrada = "summarize: " + texto
    inputs = tokenizer.encode(entrada, return_tensors="pt", truncation=True, max_length=512)
    saida = model.generate(inputs, max_length=100, num_beams=4, early_stopping=True)
    return tokenizer.decode(saida[0], skip_special_tokens=True)
