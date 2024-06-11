import datetime

class Transformer:
    def __init__(self):
        pass
    def transform(self, result):
        values, value = [], []
        for idx, receipt in enumerate(result.documents):
            transaction_date = receipt.fields.get("TransactionDate")
            if transaction_date:
                if not self.check_valid_date(transaction_date.value):
                    transaction_date.value = datetime.strftime(transaction_date.value, '%d/%y/%m')
                value.append(transaction_date.value)
            merchant_name = receipt.fields.get("MerchantName")
            if merchant_name:
                value.append(merchant_name.value)
            if receipt.fields.get("Items"):
                items = []
                for idx, item in enumerate(receipt.fields.get("Items").value):
                    item_description = item.value.get("Description")
                    item_total_price = item.value.get("TotalPrice")
                    items.append(' '.join(filter(None, (item_description.value, self.format_item_total_price(item_total_price.value)))))
                value.append(" + ".join(items))
            total = receipt.fields.get("Total")
            if total:
                value.append(total.value)

            values.append(value)

        print(values)
        return values
    
    def check_valid_date(self, date):
        return (date.year >= 2024)

    def format_item_total_price(self, price :float):
        return f"({str(price)})" if price is not None else None
