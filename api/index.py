import logging
from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from logging.config import dictConfig
from services.receipt_service import ReceiptService

app = Flask(__name__)
CORS(app)

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})
logger = logging.getLogger("azure.core.pipeline.policies.http_logging_policy")
logger.setLevel(logging.WARNING)

@app.route('/api/process-receipt', methods=['POST', 'OPTIONS'])
def process_receipt():
    app.logger.info('Received receipt %s successfully: ', request.json)
    data = request.json
    receipt_urls = data.get('receiptURLs')
    if not receipt_urls:
        return jsonify({"error": "No receipt URLs provided"}), 400
    
    key = os.environ['document_analysis_client_key']
    endpoint = os.environ['document_analysis_client_endpoint']
    receipt_service = ReceiptService(key, endpoint)

    try:
        analysis = receipt_service.process_receipt(receipt_urls)
        app.logger.info('Analysis %s successfully: ', vars(analysis))
        return jsonify(vars(analysis)), 200
    except Exception as error:
        print('Error in analysing receipt')
        raise Exception(f'{error}')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5328)