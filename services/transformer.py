from datetime import datetime
import re
import logging

from flask import current_app

from models.custom_error import ReceiptTransformError
from models.grocery_store import GroceryStoreEnum
from models.sheet_request import SheetRequest

class Transformer:
    def __init__(self):
        self.log = logging.getLogger(__name__)

    def generate_sheet_request(self, results) -> SheetRequest:
        values = []
        try:
            for result in results:
                for receipt in result["analysis"].documents:
                    transaction_date = self._transform_transaction_date(receipt.fields.get("TransactionDate"), receipt.fields.get("MerchantName"))
                    merchant_name = self._transform_merchant_name(receipt.fields.get("MerchantName"))
                    items =  self._transform_items(receipt.fields.get("Items"))
                    total = self._transform_total(receipt.fields.get("Total"), merchant_name, result["analysis"].content)
                    redeem_note = self._calculate_no_frills_redeem(result["analysis"].content) if self._is_redeemed(merchant_name, result["analysis"].content) else ""

                entry = [transaction_date, merchant_name, items, total, redeem_note, result["url"]]
                values.append(entry)

            return SheetRequest(values)
        except Exception as error:
            current_app.logger.error(f'Error occurred when transforming receipt data: {error}', exc_info=True)
            raise ReceiptTransformError(f'{error}')

    def _transform_transaction_date(self, transaction_date, merchant_name):
        if transaction_date and merchant_name:
            if not self._check_valid_date(transaction_date.value) and GroceryStoreEnum.check_mapping(merchant_name.value):
                if self._transform_merchant_name(merchant_name) == "No Frills":
                    original = transaction_date.value
                    transaction_date.value = datetime.strftime(original, '%d/%m/%y')
                    self.log.info('No Frills Receipt Date was transformed from %s (d/m/y format) to %s', original, transaction_date.value)
            return str(transaction_date.value)

    def _transform_merchant_name(self, merchant_name):
        if merchant_name and GroceryStoreEnum.check_mapping(merchant_name.value):
            return GroceryStoreEnum.map_to_enum(merchant_name.value).value

    def _transform_items(self, items):
        if items:
            item_entry = []
            for item in items.value:
                item_description = item.value.get("Description").value if item.value.get("Description") is not None else ''
                item_total_price = item.value.get("TotalPrice").value if item.value.get("TotalPrice") is not None else -1
                item_entry.append(' '.join([item_description, self._format_item_price(item_total_price)]))
            return ' + '.join(item_entry)

    def _transform_total(self, total, merchant_name, text):
        if total:
            if merchant_name == GroceryStoreEnum.NO_FRILLS.value:
                match = re.search(r'CREDIT TN\n(\d+\.\d+)', text)
                return float(match.group(1)) if match else total.value
            return total.value
        
    def _is_redeemed(self, merchant_name, text):
        if merchant_name == GroceryStoreEnum.NO_FRILLS.value:
            match = re.search(r'LOYALTY', text)
            return match is not None
        return False
                    
    def _calculate_no_frills_redeem(self, text):
        match = re.search(r'LOYALTY\n(\d+\.\d+)', text)
        return f"Redeemed PC {match.group(1)}"
    
    def _check_valid_date(self, date):
        return (date.year >= 2024)

    def _format_item_price(self, price: float):
        return f"({str(price)})" if price is not None else None
