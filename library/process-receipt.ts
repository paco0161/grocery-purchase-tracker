import axios from "axios";
import { toast } from "react-toastify";

type ProcessResponse = {
	values: string[][];
};

export const processReceipt = async (receiptURLs: string): Promise<ProcessResponse> => {
    const URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `/api`
    : "http://localhost:5328/api";
    try {
        const { data } = await axios.request<ProcessResponse>({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: `${URL}/process-receipt`,
            data: JSON.stringify({ receiptURLs }),
        })
        return {values: data.values};
    } catch (error) {
        console.error('Unexpected Error: ', error);
        if (axios.isAxiosError(error)) {
            toast.error(error.message, {autoClose: 10000});
        }
        if (error instanceof Error) {
            toast.error(error.stack, {autoClose: 10000});
        }
        return {values: [['']]};
    }
};