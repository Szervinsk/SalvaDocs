from flask import Flask, render_template, request, jsonify
from utils.extrair_data import extrair_dados, extrair_parecer
from utils.extract_PDF import processar_pdfs
from utils.refina import refina_dados

app = Flask(__name__)

# Configuração dos serviços disponíveis
TIPOS_SERVICO = {
    'programas': {
        'extrator': extrair_dados,
        'template': 'programas.html',
        'rota': 'programas-de-integridade'
    },
    'parecer': {
        'extrator': extrair_parecer,
        'template': 'pareceres.html',
        'rota': 'parecer'
    }
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/programas-de-integridade', methods=['GET'])
def programa_de_integridade():
    return render_template(TIPOS_SERVICO['programas']['template'])

@app.route('/parecer', methods=['GET'])
def pareceres():
    return render_template(TIPOS_SERVICO['parecer']['template'])

@app.route('/analisar', methods=['POST'])
def analisar():
    arquivo = request.files.get('arquivo')
    servico = request.form.get('servico')

    # Validações básicas
    if not arquivo or not servico:
        return jsonify({'erro': 'Arquivo ou tipo de serviço ausente'}), 400

    if servico not in TIPOS_SERVICO:
        return jsonify({'erro': 'Tipo de serviço inválido'}), 400

    try:
        # Processamento do arquivo
        conteudo = processar_pdfs(arquivo)
        
        # Extração dos dados específicos
        dados = TIPOS_SERVICO[servico]['extrator'](conteudo)
        
        # Refinamento dos dados conforme o tipo de serviço
        resultado = refina_dados(dados, servico)
        
        return jsonify(resultado)
        
    except Exception as e:
        return jsonify({'erro': f'Ocorreu um erro durante o processamento: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)