from typing import List
from flask import current_app
from api.azure import AzureDocClient
from models.custom_error import APIError, ReceiptTransformError
from services.receipt_analyzer import ReceiptAnalyzer
# from services.sheet_saver import SheetSaver
from services.transformer import Transformer

class ReceiptService:
    def __init__(self, azure_key, azure_endpoint):
        self.receipt_analyzer = ReceiptAnalyzer(AzureDocClient(azure_key, azure_endpoint))
        # self.sheet_saver = SheetSaver(SheetAPIClient())
        self.transformer = Transformer()

    def process_receipt(self, receiptURLs: List[str]):
        try:
            all_analysis_result = []

            for url in receiptURLs:
                analysis = self.receipt_analyzer.analyze_receipt(url)
                all_analysis_result.append(analysis)

            return self.transformer.generate_sheet_request(all_analysis_result)
        
        except APIError as error:
            current_app.logger.error(f"API error occurred during receipt analysis: {error}", exc_info=True)
            raise APIError(f"Failed to analyze receipt: {error}") from error
        
        except ReceiptTransformError as tranformError:
            current_app.logger.error(f"Receipt Transformation error occurred: {tranformError}", exc_info=True)
            raise ReceiptTransformError(f"Failed to transform receipt data: {tranformError}") from tranformError
        
        except Exception as unexpected_error:
            current_app.logger.error(f"Unexpected error occurred: {unexpected_error}", exc_info=True)
            raise Exception(f"An unexpected error occurred: {unexpected_error}") from unexpected_error

