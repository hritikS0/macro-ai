import api from './api';

/**
 * Sends plan data to the backend to generate a clean, headless-rendered PDF
 * @param {Object} activePlan - The complete active plan data object
 * @param {string} filename - The name of the resulting file
 */
export const exportToPDF = async (activePlan, filename = 'optimal-protocol.pdf') => {
  if (!activePlan) {
    console.error("No active plan provided for export.");
    return;
  }

  try {
    const response = await api.post('/diet/export-pdf', activePlan, {
      responseType: 'arraybuffer' // Changed to arraybuffer for secure binary buffer transmission
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    
    // Create an invisible anchor tag to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};
