from transformers import MT5ForConditionalGeneration, MT5Tokenizer, Seq2SeqTrainer, Seq2SeqTrainingArguments
from datasets import load_dataset, Dataset
import pandas as pd

# Carregar modelo e tokenizer
model_name = "csebuetnlp/mT5_multilingual_XLSum"
tokenizer = MT5Tokenizer.from_pretrained(model_name)
model = MT5ForConditionalGeneration.from_pretrained(model_name)

# Carregar seus dados
df = pd.read_csv("dataset.csv")  # deve ter colunas: "text" e "summary"
dataset = Dataset.from_pandas(df)

# Pré-processamento
def preprocess(example):
    input_text = "summarize: " + example["text"]
    model_input = tokenizer(input_text, max_length=512, truncation=True, padding="max_length")
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(example["summary"], max_length=128, truncation=True, padding="max_length")
    model_input["labels"] = labels["input_ids"]
    return model_input

tokenized_dataset = dataset.map(preprocess, remove_columns=dataset.column_names)

# Argumentos de treinamento
training_args = Seq2SeqTrainingArguments(
    output_dir="./mt5_finetuned",
    evaluation_strategy="no",
    per_device_train_batch_size=4,
    learning_rate=2e-4,
    num_train_epochs=5,
    save_steps=500,
    save_total_limit=2,
    logging_steps=100,
    fp16=True,
    predict_with_generate=True,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    tokenizer=tokenizer,
)

# Iniciar treinamento
trainer.train()

# Salvar o modelo
model.save_pretrained("./mt5_finetuned")
tokenizer.save_pretrained("./mt5_finetuned")
