import axios from "axios";

type ProcessResponse = {
	analysis_results: string;
};

export const processReceipt = async (receiptURLs: string): Promise<ProcessResponse> => {
    const { data } = await axios.request<ProcessResponse>({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: '/api/process-receipt',
        data: JSON.stringify({ receiptURLs }),
    });

    return {analysis_results: data.analysis_results};
};