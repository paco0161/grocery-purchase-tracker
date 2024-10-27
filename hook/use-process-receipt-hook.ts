import { appendSheetData, getSheetData } from "@/library/google-sheet-actions";
import { processReceipt } from "@/library/process-receipt";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

function isMonthNaN(date1Str: string): boolean {
    const date1 = new Date(date1Str);
    const month1 = date1.getMonth();

    return isNaN(month1);
}

function isNextMonth(date1Str: string, date2Str: string): boolean {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();

    if (year1 === year2) {
        return month1 != month2;
    } else if (year1 === year2 + 1 && month1 === 0 && month2 === 11) {
        return true;
    }
    return false;
}

type ImageRes = {
    public_id: string;
    secure_url: string;
};

const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID!;
const sheetName = process.env.NEXT_PUBLIC_GOOGLE_SHEET_NAME!;

const table = {
    'majorDimension': 'ROWS',
    'values': []
};

export const useProcessReceipt = (images: ImageRes[] | null, shouldProcess: boolean, setIsFetching: (isFetching: boolean) => void) => {
    useEffect(() => {
        const handleProcessReceipt = async () => {
            if (!images || images.length === 0 || !shouldProcess) return;

            try {
                const analysisResults = await processReceipt(images.map((data) => data.secure_url));

                const isAnalysisEmpty = analysisResults.values.every(
                    (row) => row.every((cell) => cell === '')
                );
    
                if (!isAnalysisEmpty) {
                    const emptyResult = await appendSheetData(spreadsheetId, sheetName, table);
                    const regex = /^.*![A-Z]+\d+:[A-Z]+(\d+)$/;
                    const match = emptyResult.result.tableRange.match(regex);
    
                    if (match) {
                        const last_row = match[1];
                        const get_last_row = await getSheetData(spreadsheetId, sheetName.concat("!A", last_row, ":ZZ", last_row))
                        const last_transaction_date = get_last_row.result.values.at(0)?.at(0)
                        const current_transaction_date = analysisResults.values.at(0)?.at(0)
    
                        if (isMonthNaN(last_transaction_date!) || isNextMonth(current_transaction_date!, last_transaction_date!)) {
                            analysisResults.values.unshift([])
                            console.log(analysisResults.values)
                        }
                    }
    
                    const result = await appendSheetData(spreadsheetId, sheetName, analysisResults);
                    if (result) {
                        toast.success('Successfully added into google sheet!');
                    }
                } else {
                    toast.warn('Processed receipt contains no valid data.');
                }

            } catch (error) {
                toast.error("Error processing receipt.", { autoClose: 10000 });
            } finally {
                setIsFetching(false);
            }
        };

        handleProcessReceipt();
    }, [images, shouldProcess, setIsFetching]);

};