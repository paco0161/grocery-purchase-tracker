from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

class AzureDocClient:
    def __init__(self, azure_key, azure_endpoint):
        self.azure_key = azure_key
        self.azure_endpoint = azure_endpoint
        self.doc_analysis_client = DocumentAnalysisClient(
            endpoint=self.azure_endpoint, credential=AzureKeyCredential(self.azure_key)
        )

    def analyze_doc_from_url(self, url):
        poller =  self.doc_analysis_client.begin_analyze_document_from_url("prebuilt-receipt", url)
        return poller.result()
