import { ApiError } from "./ApiError.js";
import axios from "axios";

class QRService {
    /**
     * Parse PAN QR Data
     */
    static parsePAN(qrData) {
        try {
            const data = JSON.parse(qrData);
            return {
                panNumber: data.pan || data.number,
                fullName: data.name,
                dob: data.dob
            };
        } catch (e) {
            const panMatch = qrData.match(/PAN:([A-Z0-9]+)/i);
            const nameMatch = qrData.match(/NM:([^|]+)/i);
            const dobMatch = qrData.match(/DB:([^|]+)/i);

            if (panMatch) {
                return {
                    panNumber: panMatch[1],
                    fullName: nameMatch ? nameMatch[1].trim() : null,
                    dob: dobMatch ? dobMatch[1].trim() : null
                };
            }
            console.warn(`QRService: Unrecognized PAN QR format. Data starts with: ${qrData.substring(0, 30)}...`);
            return null;
        }
    }

    /**
     * Parse DL QR Data
     */
    static parseDL(qrData) {
        const dlMatch = qrData.match(/DLNO:([^|]+)/i);
        const nameMatch = qrData.match(/NAME:([^|]+)/i);
        const dobMatch = qrData.match(/DOB:([^|]+)/i);

        if (dlMatch) {
            return {
                licenseNumber: dlMatch[1].trim(),
                fullName: nameMatch ? nameMatch[1].trim() : null,
                dob: dobMatch ? dobMatch[1].trim() : null
            };
        }
        return null;
    }

    /**
     * Parse RC QR Data
     */
    static parseRC(qrData) {
        const vnoMatch = qrData.match(/VNO:([^|]+)/i);
        const ownerMatch = qrData.match(/OWNER:([^|]+)/i);
        const rcMatch = qrData.match(/RCNO:([^|]+)/i);

        if (vnoMatch) {
            return {
                vehicleNumber: vnoMatch[1].trim(),
                ownerName: ownerMatch ? ownerMatch[1].trim() : null,
                rcNumber: rcMatch ? rcMatch[1].trim() : null
            };
        }
        return null;
    }

    /**
     * Verify Parity between QR data and Image OCR (via Groq API)
     */
    static async verifyParity(qrExtracted, imageUrl, docType) {
        if (!qrExtracted || !imageUrl) return { score: 0, isMatch: false };

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new ApiError(500, "Groq API key is missing");

        const prompt = `
            Act as a Senior Forensic Document Specialist. Analyze this ${docType} card image against the "Anchored Truth" from the QR scan:
            Name: ${qrExtracted.fullName || qrExtracted.ownerName}
            Number: ${qrExtracted.panNumber || qrExtracted.licenseNumber || qrExtracted.vehicleNumber}
            DOB: ${qrExtracted.dob || 'N/A'}

            Zero-Tolerance Forensic Checklist:
            1. **Hologram/Hallowmark**: Is the official government hologram present? Does it show prismatic reflection/depth (real) or is it a flat grey/noisy blotch (photocopy)?
            2. **Official Signature/Seal**: Is the government issuing authority's signature or seal present and crisp? Rejection highly if pixelated or missing.
            3. **Physical Depth**: Does the card show "Depth" and "Edge-Shadows" of a plastic ID card? (Reject if it looks like a flat paper printout or a photo of a screen).
            4. **Moiré/Screen Patterns**: Look for tiny wavy lines (Moiré) that appear when photographing a screen.
            5. **Font Integrity**: Check if the font weight of the Number (${qrExtracted.panNumber || qrExtracted.licenseNumber || qrExtracted.vehicleNumber}) matches the surrounding text exactly.

            Return a RAW JSON object ONLY:
            {
                "visualName": "...",
                "visualNumber": "...",
                "matchScore": 0-100,
                "fraudScore": 0-100,
                "isFabricated": boolean,
                "isScreenPhoto": boolean,
                "isPhotocopy": boolean,
                "hologramPresent": boolean,
                "signaturePresent": boolean,
                "forensicAnalysis": "...",
                "reason": "..."
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

            const result = JSON.parse(response.data.choices[0].message.content);
            return {
                ...result,
                // Zero-Tolerance: Fail if ANY major forensic marker is negative
                isMatch: result.matchScore >= 95 &&
                    result.fraudScore === 0 &&
                    !result.isFabricated &&
                    !result.isScreenPhoto &&
                    !result.isPhotocopy &&
                    result.hologramPresent !== false &&
                    result.signaturePresent !== false
            };
        } catch (error) {
            console.error("Parity Verification Error:", error.response?.data || error.message);
            return { score: 0, isMatch: false, error: "AI Analysis failed" };
        }
    }
}

export default QRService;
