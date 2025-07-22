from transformers import pipeline

summarizer = pipeline("summarization", model="unicamp-dl/ptt5-base-portuguese-vocab")

texto = """
texto
"""

resumo = summarizer("resuma: " + texto, max_length=120, min_length=30, do_sample=False, truncation=True)
print("Resumo:", resumo[0]['summary_text'])
