import api.azure

class ReceiptAnalyzer:
    def __init__(self, azure_key, azure_endpoint):
        self.azure_api_client = api.azure.AzureDocClient(azure_key, azure_endpoint)

    def analyze_receipt(self, url: str=None):
        # #url  = "https://emo39ri1zkx7kmwj.public.blob.vercel-storage.com/no-frills-receipt-redeem"\
        # url = "https://emo39ri1zkx7kmwj.public.blob.vercel-storage.com/walmart_receipt-oDFOPORe76ezGYelZVBwSq0GcQtxcH.jpeg"
        # # url = "https://emo39ri1zkx7kmwj.public.blob.vercel-storage.com/freshway_check_date-2DBJdaQyqCsgESW4FBmDczX3FwQ2CG.jpeg"
        return self.azure_api_client.analyze_doc_from_url(url)

    def log_analysis(result):
        for idx, receipt in enumerate(result.documents):
            print("--------Recognizing receipt #{}--------".format(idx + 1))
            receipt_type = receipt.doc_type
            if receipt_type:
                print(
                    "Receipt Type: {}".format(receipt_type)
                )
            merchant_name = receipt.fields.get("MerchantName")
            if merchant_name:
                print(
                    "Merchant Name: {}".format(
                        merchant_name.value
                    )
                )
            transaction_date = receipt.fields.get("TransactionDate")
            if transaction_date:
                print(
                    "Transaction Date: {} {}".format(
                        transaction_date.value, transaction_date.confidence
                    )
                )
            if receipt.fields.get("Items"):
                print("Receipt items:")
                for idx, item in enumerate(receipt.fields.get("Items").value):
                    print("...Item #{}".format(idx + 1))
                    item_description = item.value.get("Description")
                    if item_description:
                        print(
                            "......Item Description: {}".format(
                                item_description.value
                            )
                        )
                    item_quantity = item.value.get("Quantity")
                    if item_quantity:
                        print(
                            "......Item Quantity: {}".format(
                                item_quantity.value
                            )
                        )
                    item_price = item.value.get("Price")
                    if item_price:
                        print(
                            "......Individual Item Price: {}".format(
                                item_price.value
                            )
                        )
                    item_total_price = item.value.get("TotalPrice")
                    if item_total_price:
                        print(
                            "......Total Item Price: {}".format(
                                item_total_price.value
                            )
                        )
            subtotal = receipt.fields.get("Subtotal")
            if subtotal:
                print(
                    "Subtotal: {}".format(
                        subtotal.value
                    )
                )
            tax = receipt.fields.get("TotalTax")
            if tax:
                print("Tax: {}".format(tax.value))
            tip = receipt.fields.get("Tip")
            if tip:
                print("Tip: {}".format(tip.value))
            total = receipt.fields.get("Total")
            if total:
                print("Total: {}".format(total.value))
            print("--------------------------------------")

    if __name__ == "__main__":
        log_analysis(analyze_receipt())