import axios from "axios";
import { toast } from "react-toastify";

type ProcessResponse = {
	values: string[][];
};

export const processReceipt = async (receiptURLs: string[]): Promise<ProcessResponse> => {
    const URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `/api`
    : "http://localhost:5328/api";
    try {
        const { data } = await axios.request<ProcessResponse>({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: `${URL}/process-receipt`,
            data: { receiptURLs },
        })
        return {values: data.values};
    } catch (error) {
        console.error('Unexpected Error: ', error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Handle backend errors and display the error message
                const backendError = error.response.data?.error ? JSON.stringify(error.response.data.error) : 'Unknown backend error';

                if (error.response.status === 504) {
                    toast.error('The request timed out while processing your receipts. Please try again later.', { autoClose: 10000 });
                } else {
                    toast.error(`Backend Error: ${backendError}`, { autoClose: 10000 });
                }
            } else {
                // Handle network or request issues
                toast.error(`Request Error: ${error.message}`, { autoClose: 10000 });
            }
        } else if (error instanceof Error) {
            // Handle client-side errors
            toast.error(`Client Error: ${error.message}`, {autoClose: 10000});
        } else {
            // Handle unknown errors
            toast.error('An unknown error occurred', { autoClose: 10000 });
        }
        return {values: [['']]};
    }
};