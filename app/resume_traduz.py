from transformers import NllbTokenizer, AutoModelForSeq2SeqLM, pipeline

# Tradução pt → en com NLLB
modelo_traducao = "facebook/nllb-200-3.3B"
tokenizer_trad = NllbTokenizer.from_pretrained(modelo_traducao)
modelo_trad = AutoModelForSeq2SeqLM.from_pretrained(modelo_traducao)

def traduzir_pt_en(texto):
    inputs = tokenizer_trad(texto, return_tensors="pt", truncation=True, max_length=512, src_lang="por_Latn")
    lang_id = tokenizer_trad.lang_code_to_id["eng_Latn"]
    output = modelo_trad.generate(**inputs, forced_bos_token_id=lang_id)
    traducao = tokenizer_trad.decode(output[0], skip_special_tokens=True)
    return traducao

# Resumo em inglês com BART
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def resumir_em_ingles(texto_en):
    resumo = summarizer(texto_en, max_length=200, min_length=60, do_sample=False)
    return resumo[0]["summary_text"]

# Pipeline completo: pt → en → resumo
def resumir_texto_portugues(texto_pt):
    texto_en = traduzir_pt_en(texto_pt)
    print("\nTexto traduzido:", texto_en)
    resumo_en = resumir_em_ingles(texto_en)
    print("\nResumo gerado:", resumo_en)
    return resumo_en

# Exemplo de uso
if __name__ == "__main__":
    texto = """
    O contrato nº 9913/2025 firmado com a empresa Dan Hebert Engenharia S/A visa à execução de serviços técnicos especializados em infraestrutura e manutenção predial...
    """
    resumo_final = resumir_texto_portugues(texto)
    print("\n✅ Resumo Final:\n", resumo_final)
