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
    static async groqIdentify(imageUrl, docType, expectedName = "") {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return null;

        let prompt = "";

        if (docType === 'INSURANCE') {
            prompt = `
                Act as a Forensic Document Analyst. Analyze this INSURANCE POLICY document.
                ${expectedName ? `The expected policy holder is likely: "${expectedName}".` : ""}
                
                1. **Extraction**:
                   - **fullName**: Extract the policy holder name. If it phonetically matches "${expectedName}", prefer the profile spelling.
                   - **policyNumber**: Extract the unique Policy Number.
                   - **expiryDate**: Extract the policy Expiry Date (Valid To).
                
                2. **Forensics**:
                   - **Originality**: Insurance policies are often paper printouts or PDFs. This is ACCEPTABLE.
                   - **Forgery**: Look for obvious digital tampering (mismatched fonts, pasted text).
                   
                Return JSON:
                {
                    "data": { "fullName": "...", "policyNumber": "...", "expiryDate": "..." },
                    "fraudScore": 0-100,
                    "isAuthentic": true,
                    "forensics": { "physicalityConfidence": "MEDIUM" },
                    "forensicNote": "..."
                }
            `;
        } else if (docType === 'BANK') {
            prompt = `
                Act as a Forensic Financial Analyst. Analyze this BANK PROOF (Cheque/Passbook/Statement).
                ${expectedName ? `The expected account holder is likely: "${expectedName}".` : ""}
                
                1. **Extraction**:
                   - **fullName**: Extract account holder name. Match with "${expectedName}" if close.
                   - **accountNumber**: Extract Bank Account Number.
                   - **ifsc**: Extract IFSC Code.
                   - **bankName**: Extract Bank Name.
                
                2. **Forensics**:
                   - **Originality**: Online statements or physical passbooks are valid.
                   - **Forgery**: Check for digital edits on the name/account number.
                   
                Return JSON:
                {
                    "data": { "fullName": "...", "accountNumber": "...", "ifsc": "...", "bankName": "..." },
                    "fraudScore": 0-100,
                    "isAuthentic": true,
                    "forensics": { "physicalityConfidence": "MEDIUM" },
                    "forensicNote": "..."
                }
            `;
        } else {
            // Default for IDs (Aadhaar, PAN, DL, RC)
            prompt = `
                Act as a Senior Forensic Document Specialist. Analyze this ${docType} image.
                ${expectedName ? `The expected holder name on the card is likely: "${expectedName}".` : ""}
                
                1. **Extraction**: 
                   - **fullName**: Extract ONLY the name. DO NOT include gender, father's names, or titles. Remove words like "Male", "Female", "S/O", "D/O".
                   - **Verification**: If the visible text is a common OCR misreading or phonetic match of "${expectedName}" (e.g., misreading 'm' as 'nb'), prefer the correct spelling from the profile.
                   - **idNumber**: Extract the unique document number accurately.
                   - **dob**: Extract the date of birth.
                
                2. **Forensics**: 
                   - **Physicality**: Does this look like a physical card held/placed in the real world? Look for natural light reflection, shadows, card edges, and texture.
                   - **Originality**: Does the text look printed on plastic/paper vs displayed on a screen?
                   - **Hologram**: Is there any glint or security seal visible?
                
                Rule: If the image clearly shows natural shadows/depth and natural pen-strokes, it is likely a physical original even if the hologram is faint.

                Return a RAW JSON object ONLY (no markdown):
                {
                    "data": {
                        "fullName": "extracted name",
                        "idNumber": "extracted document number",
                        "dob": "extracted date of birth"
                    },
                    "fraudScore": 0-100,
                    "isAuthentic": true,
                    "forensics": { ... },
                    "forensicNote": "..."
                }
            `;
        }

        try {
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: "qwen/qwen3.6-27b",
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
