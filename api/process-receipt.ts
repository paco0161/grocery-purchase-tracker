import axios from "axios";

type ProcessResponse = {
	analysis_results: string;
};

export const processReceipt = async (receiptURLs: string): Promise<ProcessResponse> => {
    const URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
    : "http://localhost:3000/api";
    const { data } = await axios.request<ProcessResponse>({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: `${URL}/process-receipt`,
        data: JSON.stringify({ receiptURLs }),
    });

    return {analysis_results: data.analysis_results};
};