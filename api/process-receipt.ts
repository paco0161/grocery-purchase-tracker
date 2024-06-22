import axios from 'axios';

const processReceipt = async (receiptURLs: string): Promise<any> => {
  try {
    const response = await axios.request({
        method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		url: '/api/process-receipt',
		data: { receiptURLs },
    });
    return response.data;
  } catch (err) {
    throw new Error('An error occurred');
  }
};

export default processReceipt;