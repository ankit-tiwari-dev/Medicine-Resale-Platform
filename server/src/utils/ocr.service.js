import { createWorker } from 'tesseract.js';
import axios from "axios";

/**
 * OCR Service
 * Handles text extraction from document images (PAN, DL, Insurance, Bank)
 */
class OCRService {
    /**
     * Extracts text using Tesseract.js (Local OCR)
     */
    static async extractText(image) {
        const worker = await createWorker('eng');
        const { data: { text } } = await worker.recognize(image);
        await worker.terminate();
        return text;
    }

    /**
     * Use Groq Vision for smart identity extraction (Cloud AI)
     */
    static async groqIdentify(imageUrl, docType) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return null;

        const prompt = `
            Act as a Senior Forensic Document Specialist. Extract details from this ${docType} image and perform a strict authenticity audit.
            
            Hard-Reject Forensics:
            - **Hologram Check**: Verify the presence of official holograms/seals. Reject if missing or flat.
            - **Signature Check**: Verify the official government signature. Reject if pixelated, blurry, or missing.
            - **Photostat/Digital Mask**: Detect if this is a scan of a B&W photocopy or a digitally altered image.
            - **Moiré Detection**: Detect screen-capture artifacts (wavy lines).

            Return a RAW JSON object ONLY:
            {
                "data": { ... },
                "fraudScore": 0-100,
                "isAuthentic": boolean (Hard reject if false),
                "hologramValid": boolean,
                "signatureValid": boolean,
                "forensicNote": "..."
            }
        `;

        try {
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                { type: "image_url", image_url: { url: imageUrl } }
                            ]
                        }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 60000
                }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error("Groq Extraction Error:", error.response?.data || error.message);
            return null;
        }
    }

    static parsePAN(text) {
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        const match = text.match(panRegex);
        return match ? { panNumber: match[0], rawText: text } : null;
    }

    static parseDL(text) {
        const dlRegex = /([A-Z]{2}[0-9]{2,13})/;
        const match = text.match(dlRegex);
        return match ? { licenseNumber: match[0], rawText: text } : null;
    }

    static parseInsurance(text) {
        const policyRegex = /Policy No[:\s]+([A-Z0-9/]+)/i;
        const expiryRegex = /Valid Upto[:\s]+(\d{2}[-/]\d{2}[-/]\d{4})/i;
        const policy = text.match(policyRegex);
        const expiry = text.match(expiryRegex);
        return (policy || expiry) ? { policyNumber: policy ? policy[1] : null, expiryDate: expiry ? expiry[1] : null } : null;
    }

    static parseBankProof(text) {
        const accRegex = /Account No[:\s]+(\d{9,18})/i;
        const ifscRegex = /IFSC[:\s]+([A-Z]{4}0[A-Z0-9]{6})/i;
        const acc = text.match(accRegex);
        const ifsc = text.match(ifscRegex);
        return (acc || ifsc) ? { accountNumber: acc ? acc[1] : null, ifsc: ifsc ? ifsc[1] : null } : null;
    }
}

export default OCRService;
