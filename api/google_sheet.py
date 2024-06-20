import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

class SheetAPIClient:
    SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

    def __init__(self):
        pass

    def _get_credentials(self):
        """Shows basic usage of the Sheets API.
        Prints values from a sample spreadsheet.
        """
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file("token.json", self.SCOPES)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                        "credentials.json", self.SCOPES
                )
                creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open("token.json", "w") as token:
                token.write(creds.to_json())
        return creds
    
    def _build_service(self):
        return build("sheets", "v4", credentials=self._get_credentials())
    
    def append(self, sheetRequest, **kwargs):
        try:
            service = self._build_service()

            # Call the Sheets API
            sheet = service.spreadsheets().values()
            result = (
                sheet
                .append(spreadsheetId=kwargs['SPREADSHEET_ID'], range=kwargs['RANGE_NAME'],
                        includeValuesInResponse=kwargs['INCLUDE_VALUES_IN_RESPONSE'],
                        valueInputOption=kwargs['VALUE_INPUT_OPTION'], insertDataOption=kwargs['INSERT_DATA_OPTION'], body=vars(sheetRequest))
                .execute()
            )

            print(f'''Updated spreadsheet table {result['tableRange']}, 
                append data {result['updates']['updatedData']['values']}
                in {result['updates']['updatedRange']}''')
        except HttpError as err:
            print(err)
