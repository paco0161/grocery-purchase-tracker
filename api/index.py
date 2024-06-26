from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from services.receipt_service import ReceiptService

app = Flask(__name__)
app.secret_key= os.environ['FLASK_SECRET_KEY']
CORS(app)

@app.route('/api/process-receipt', methods=['POST'])
def process_receipt():
    app.logger.info('Received receipt %s successfully', request.json)
    data = request.json
    receipt_urls = data.get('receiptURLs')
    if not receipt_urls:
        return jsonify({"error": "No receipt URLs provided"}), 400
    
    key = os.environ['document_analysis_client_key']
    endpoint = os.environ['document_analysis_client_endpoint']
    receipt_service = ReceiptService(key, endpoint)

    analysis = receipt_service.process_receipt(receipt_urls)
    app.logger.info('Analysis %s successfully', vars(analysis))
    return jsonify(vars(analysis)), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5328)