from api.azure import AzureDocClient
from services.receipt_analyzer import ReceiptAnalyzer
# from services.sheet_saver import SheetSaver
from services.transformer import Transformer

class ReceiptService:
    def __init__(self, azure_key, azure_endpoint):
        self.receipt_analyzer = ReceiptAnalyzer(AzureDocClient(azure_key, azure_endpoint))
        # self.sheet_saver = SheetSaver(SheetAPIClient())
        self.transformer = Transformer()

    def process_receipt(self, receiptURLs: str):
        analysis = self.receipt_analyzer.analyze_receipt(receiptURLs)
        return self.transformer.generate_sheet_request(analysis)
