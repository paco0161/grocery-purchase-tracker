import logging
from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from logging.config import dictConfig
from models.cors_decorator import crossdomain
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
azureLogger = logging.getLogger("azure.core.pipeline.policies.http_logging_policy")
azureLogger.setLevel(logging.WARNING)

@app.route('/api/process-receipt', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*')
def process_receipt():
    app.logger.info(f"Received receipt data: {request.json}")
    data = request.json
    receipt_urls = data.get('receiptURLs')

    if not receipt_urls:
        app.logger.warning('No receipt URLs provided')
        return jsonify({"error": "No receipt URLs provided"}), 400
    
    key = os.environ.get('document_analysis_client_key')
    endpoint = os.environ.get('document_analysis_client_endpoint')

    if not key or not endpoint:
        app.logger.error('Document analysis service credentials are missing')
        return jsonify({"error": "Service credentials missing"}), 500

    receipt_service = ReceiptService(key, endpoint)

    try:
        analysis = receipt_service.process_receipt(receipt_urls)
        app.logger.info(f"Analyzed Receipt(s): {vars(analysis)}")
        return jsonify(vars(analysis)), 200
    except Exception as error:
        app.logger.error(f'Error in analyzing receipt: {error}', exc_info=True)
        return jsonify({'error': str(error)}), 500