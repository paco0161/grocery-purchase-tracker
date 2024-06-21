from flask import Flask, request, jsonify
import os
from flask_cors import CORS

from services.receipt_service import ReceiptService

app = Flask(__name__)
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

    analysis_results = []
    # for url in receipt_urls:
    analysis = receipt_service.process_receipt(receipt_urls)
    analysis_results.append(analysis)

    return jsonify(analysis_results), 200

if __name__ != "__main__":
    # Required for Vercel serverless function
    from flask import Request as VercelRequest, Response as VercelResponse

    def handler(request: VercelRequest) -> VercelResponse:
        with app.request_context(request.environ):
            response = app.full_dispatch_request()
            return VercelResponse(response.response, response.status_code, response.headers)
else:
    app.run(debug=True, host='0.0.0.0', port=5328)