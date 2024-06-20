from sorcery import dict_of 

class SheetSaver:
    # Constant Class Attributes
    SPREADSHEET_ID = "1u-xmhjFZAYAAkV0ZBNggg7Nf-nZclkR9-PN5FStXDEM"
    RANGE_NAME = "'Monthly Grocery Purchase'"
    INCLUDE_VALUES_IN_RESPONSE = True
    VALUE_INPUT_OPTION = "USER_ENTERED"
    INSERT_DATA_OPTION = "INSERT_ROWS"
    options = dict_of(SPREADSHEET_ID, RANGE_NAME, 
                     INCLUDE_VALUES_IN_RESPONSE, VALUE_INPUT_OPTION, INSERT_DATA_OPTION) 

    def __init__(self, sheet_api_client):
        self.sheet_api_client = sheet_api_client

    def append_to_google_sheet(self, sheetRequest):
        self.sheet_api_client.append(sheetRequest, **self.options)

if __name__ == "__main__":
    sheet_saver = SheetSaver()
    sheet_saver.append_to_google_sheet()