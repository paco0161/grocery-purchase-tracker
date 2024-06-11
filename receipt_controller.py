import os
from services.receipt_analyzer import ReceiptAnalyzer
from services.sheet_saver import SheetSaver
from services.transformer import Transformer

class ReceiptController:
    def __init__(self, azure_key, azure_endpoint):
        self.receipt_analyzer = ReceiptAnalyzer(azure_key, azure_endpoint)
        self.sheet_saver = SheetSaver()
        self.transformer = Transformer()

    def process_receipt(self, receiptURL):
        analysis = self.receipt_analyzer.analyze_receipt(receiptURL)
        self.sheet_saver.append_to_google_sheet(self.transform_analysis(analysis))

    def transform_analysis(self, analyzed_data):
        return self.transformer.transform(analyzed_data)

if __name__ == "__main__":
    key = os.environ['document_analysis_client_key']
    endpoint = os.environ['document_analysis_client_endpoint']
    receiptURL = "https://emo39ri1zkx7kmwj.public.blob.vercel-storage.com/no-frills-receipt-redeem"
    controller = ReceiptController(key, endpoint)
    controller.process_receipt(receiptURL)