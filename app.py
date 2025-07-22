from flask import Flask, render_template, request, jsonify
from utils.extrair_data import extrair_dados
from utils.extract_PDF import processar_pdfs
from utils.refina import refina_dados

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analisar', methods=['POST'])
def analisar():
    arquivo = request.files['arquivo']
    conteudo = processar_pdfs(arquivo)
    dados = extrair_dados(conteudo)
    refina = refina_dados(dados)
    return jsonify(refina)

if __name__ == '__main__':
    app.run(debug=True)
