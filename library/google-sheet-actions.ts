'use server'
import { google } from "googleapis";

type AnalysisResultProps = {
    values: string[][]
};

export async function getSheetData() { 
    const glAuth = await getGoogleAuthClient();
  
    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    const SPREADSHEET_ID = "1u-xmhjFZAYAAkV0ZBNggg7Nf-nZclkR9-PN5FStXDEM"
    const RANGE_NAME = "'Monthly Grocery Purchase'"
    const get_data = await glSheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_NAME,
    });
  
    return { result: get_data.data.values };
}

export async function appendSheetData(analysis_results: AnalysisResultProps) { 
    const glAuth = await getGoogleAuthClient();
  
    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    const SPREADSHEET_ID = "1u-xmhjFZAYAAkV0ZBNggg7Nf-nZclkR9-PN5FStXDEM"
    const RANGE_NAME = "'Monthly Grocery Purchase'"
    const INCLUDE_VALUES_IN_RESPONSE = true
    const VALUE_INPUT_OPTION = "USER_ENTERED"
    const INSERT_DATA_OPTION = "INSERT_ROWS"

    const append_valeus = await glSheets.spreadsheets.values.append({
        auth: glAuth,
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_NAME,
        includeValuesInResponse: INCLUDE_VALUES_IN_RESPONSE,
        valueInputOption: VALUE_INPUT_OPTION,
        insertDataOption: INSERT_DATA_OPTION,
        requestBody: {
            values: analysis_results.values
        }
    });
  
    return { result: append_valeus.data };
}

export async function getGoogleAuthClient() {
    return google.auth.getClient({
        projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
        credentials: {
            "type": "service_account",
            "project_id": process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
            "private_key_id": process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY_ID,
            "private_key": process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY,
            "client_email": process.env.NEXT_PUBLIC_CLIENT_EMAIL,
            "universe_domain": "googleapis.com"
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
}