from sorcery import dict_of
from api.google_sheet import SheetAPIClient

class SheetSaver:
    # Constant Class Attributes
    SPREADSHEET_ID = "1u-xmhjFZAYAAkV0ZBNggg7Nf-nZclkR9-PN5FStXDEM"
    RANGE_NAME = "'Monthly Grocery Purchase'"
    INCLUDE_VALUES_IN_RESPONSE = True
    VALUE_INPUT_OPTION = "USER_ENTERED"
    INSERT_DATA_OPTION = "INSERT_ROWS"
    options = dict_of(SPREADSHEET_ID, RANGE_NAME, 
                     INCLUDE_VALUES_IN_RESPONSE, VALUE_INPUT_OPTION, INSERT_DATA_OPTION) 

    def __init__(self):
        self.sheet_api_client = SheetAPIClient()

    def append_to_google_sheet(self, values: list=None):
        self.sheet_api_client.append(values, **self.options)

if __name__ == "__main__":
    sheet_saver = SheetSaver()
    sheet_saver.append_to_google_sheet()