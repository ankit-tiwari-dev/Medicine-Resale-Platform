import { createWorker } from 'tesseract.js';

/**
 * OCR Service
 * Handles text extraction from document images (PAN, DL)
 */
class OCRService {
    /**
     * Extracts text from an image buffer or URL
     * @param {Buffer|string} image - The image data
     * @returns {Promise<string>} - Extracted text
     */
    static async extractText(image) {
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(image);
        await worker.terminate();
        return text;
    }

    /**
     * Specifically parses PAN Details from OCR text
     * @param {string} text - Raw OCR text
     * @returns {Object|null} - Parsed info
     */
    static parsePAN(text) {
        // Regex for PAN: 5 letters, 4 digits, 1 letter
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        const match = text.match(panRegex);

        if (match) {
            return {
                panNumber: match[0],
                rawText: text
            };
        }
        return null;
    }

    /**
     * Specifically parses DL Details from OCR text
     * @param {string} text - Raw OCR text
     * @returns {Object|null} - Parsed info
     */
    static parseDL(text) {
        // DL format's vary by state but usually start with 2 letters (state code)
        // Simple regex to catch potential DL format: STATE_CODE followed by number
        const dlRegex = /([A-Z]{2}[0-9]{2,13})/;
        const match = text.match(dlRegex);

        if (match) {
            return {
                licenseNumber: match[0],
                rawText: text
            };
        }
        return null;
    }
}

export default OCRService;
