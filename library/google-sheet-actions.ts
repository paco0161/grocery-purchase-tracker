'use server'
import { google } from "googleapis";

type AnalysisResultProps = {
    values: string[][]
};

type GetSheetDataResponse = {
    range: string,
    majorDimension: string,
    values: string[][]
}

type AppendSheetDataResponse = {
    spreadsheetId: string;
    tableRange: string;
    updates: {
        spreadsheetId: string;
        updatedRange: string;
        updatedData: {
            range: string;
            majorDimension: string;
        };
    };
}

export async function getSheetData(spreadsheetId: string, range_name: string): Promise<{result: GetSheetDataResponse}> { 
    const glAuth = await getGoogleAuthClient();
  
    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    const SPREADSHEET_ID = spreadsheetId
    const RANGE_NAME = range_name
    const get_data = await glSheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_NAME,
    });
  
    return { result: get_data.data as GetSheetDataResponse };
}

export async function appendSheetData(spreadsheetId: string, range_name: string, analysis_results: AnalysisResultProps): Promise<{result: AppendSheetDataResponse}> { 
    const glAuth = await getGoogleAuthClient();
  
    const glSheets = google.sheets({ version: "v4", auth: glAuth });

    const SPREADSHEET_ID = spreadsheetId
    const RANGE_NAME = range_name
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
  
    return { result: append_valeus.data as AppendSheetDataResponse };
}

export async function getGoogleAuthClient() {
    try {
        const credential = JSON.parse(
            Buffer.from(process.env['GOOGLE_SERVICE']!, "base64").toString()
        );
        return google.auth.getClient({
            projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
            credentials: credential,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    } catch (error) {
        console.log('Error when parsing JSON:', error);
    }
}