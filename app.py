from flask import Flask, render_template, request, jsonify, send_file
from utils.extrair_data import extrair_dados, extrair_parecer, extrair_despacho
from utils.extract_PDF import processar_pdfs
from utils.refina import refina_dados
import os
import uuid

app = Flask(__name__)

# Configuração dos serviços disponíveis
TIPOS_SERVICO = {
    'programas': {
        'extrator': extrair_dados,
    },
    'parecer': {
        'extrator': extrair_parecer,
    },
    'despachos': {
        'extrator': extrair_despacho,
    }
}

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analisar', methods=['POST'])
def analisar():
    arquivo = request.files.get('arquivo')
    servico = request.form.get('servico')

    if not arquivo or not servico:
        return jsonify({'erro': 'Arquivo ou tipo de serviço ausente'}), 400

    if servico not in TIPOS_SERVICO:
        return jsonify({'erro': 'Tipo de serviço inválido'}), 400

    try:
        # Salvar o arquivo com um nome único temporário
        temp_id = str(uuid.uuid4())
        caminho_temp = os.path.join(UPLOAD_FOLDER, f'{temp_id}.pdf')
        arquivo.save(caminho_temp)

        # Processa o conteúdo do PDF
        conteudo = processar_pdfs(caminho_temp)
        dados_extraidos = TIPOS_SERVICO[servico]['extrator'](conteudo)
        resultado = refina_dados(dados_extraidos, servico)

        # Gera nome de arquivo baseado no Gdoc (ou outro identificador)
        # Gera nome de arquivo personalizado conforme o tipo
        if servico == 'despachos':
            nome_base = resultado.get('Gdoc') or resultado.get('despacho') or 'Despacho'
            nome_final = f"Despacho {nome_base.replace('/', '-').replace('\\', '-')}.pdf"

        elif servico == 'parecer':
            nome_base = resultado.get('gdoc') or resultado.get('gdoc') or 'Parecer'
            nome_final = f"Parecer {nome_base.replace('/', '-').replace('\\', '-')}.pdf"

        elif servico == 'programas':
            nome_base = resultado.get('contrato') or 'Programa'
            nome_final = f"Programa {nome_base.replace('/', '-').replace('\\', '-')}.pdf"

        else:
            nome_final = "Documento.pdf"


        # Adiciona link de download à resposta
        # Adiciona link de download à resposta JSON
        resultado['download_url'] = f"/baixar/{temp_id}?nome={nome_final}"

        return jsonify(resultado)

    except Exception as e:
        return jsonify({'erro': f'Ocorreu um erro durante o processamento: {str(e)}'}), 500

@app.route('/baixar/<id>')
def baixar(id):
    nome_final = request.args.get('nome', 'documento.pdf')
    caminho = os.path.join(UPLOAD_FOLDER, f'{id}.pdf')

    if not os.path.exists(caminho):
        return "Arquivo não encontrado", 404

    return send_file(caminho, as_attachment=True, download_name=nome_final)

if __name__ == '__main__':
    app.run(debug=True)
