const processReceipt = async (receiptURLs: string) => {
    try {
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
    } catch (err) {
      throw new Error('An error occurred');
    }
};
  
module.exports = processReceipt;