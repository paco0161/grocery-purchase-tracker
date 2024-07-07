from datetime import datetime
import re

from models.custom_error import ReceiptTransformError
from models.grocery_store import GroceryStoreEnum
from models.sheet_request import SheetRequest

class Transformer:
    def __init__(self):
        pass

    def generate_sheet_request(self, result) -> SheetRequest:
        values = []
        try:
            for receipt in result.documents:
                transaction_date = self._transform_transaction_date(receipt.fields.get("TransactionDate"))
                merchant_name = self._transform_merchant_name(receipt.fields.get("MerchantName"))
                items =  self._transform_items(receipt.fields.get("Items"))
                total = self._transform_total(receipt.fields.get("Total"), merchant_name, result.content)
                redeem_note = self._calculate_no_frills_redeem(result.content) if self._is_redeemed(merchant_name, result.content) else ""

                entry = [transaction_date, merchant_name, items, total, redeem_note]
                values.append(entry)

            return SheetRequest(values)
        except Exception as error:
            print('Error in transforming receipt data')
            raise ReceiptTransformError(f'{error}')

    def _transform_transaction_date(self, transaction_date):
        if transaction_date:  
            if not self._check_valid_date(transaction_date.value):
                transaction_date.value = datetime.strftime(transaction_date.value, '%d/%y/%m')
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
                return float(match.group(1)) if match else total
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
