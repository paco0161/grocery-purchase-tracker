import os
from api.azure import AzureDocClient
from api.google_sheet import SheetAPIClient
from services.receipt_analyzer import ReceiptAnalyzer
from services.sheet_saver import SheetSaver
from services.transformer import Transformer

class ReceiptController:
    def __init__(self, azure_key, azure_endpoint):
        self.receipt_analyzer = ReceiptAnalyzer(AzureDocClient(azure_key, azure_endpoint))
        self.sheet_saver = SheetSaver(SheetAPIClient())
        self.transformer = Transformer()

    def process_receipt(self, receiptURLs: list):
        analysis = self.receipt_analyzer.analyze_receipt(receiptURL for receiptURL in receiptURLs)
        self.sheet_saver.append_to_google_sheet(self.transformer.generate_sheet_request(analysis))

if __name__ == "__main__":
    key = os.environ['document_analysis_client_key']
    endpoint = os.environ['document_analysis_client_endpoint']
    receiptURL = "https://emo39ri1zkx7kmwj.public.blob.vercel-storage.com/no_frills_receipt-ZpucBZ3A8uljhFcEJ1xFMU9Q18lcMJ.jpeg"
    controller = ReceiptController(key, endpoint)
    controller.process_receipt([receiptURL])