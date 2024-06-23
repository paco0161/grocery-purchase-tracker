type ProcessResponse = {
	analysis_results: string;
};

const processReceipt = async (receiptURLs: string): Promise<ProcessResponse> => {
    const response = await fetch('/api/process-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptURLs }),
    });

    if (!response.ok) {
        throw new Error('An error occurred');
    }

    const data = await response.json();
    return data;
};

module.exports = processReceipt;