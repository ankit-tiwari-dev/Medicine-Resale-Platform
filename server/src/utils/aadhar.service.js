import zlib from 'zlib';
import fs from 'fs';

/**
 * Aadhaar Secure QR Service
 * Handles decoding and data extraction from Aadhaar Secure QR codes (V4)
 */
class AadharService {
    /**
     * Decodes the long decimal string from Aadhaar Secure QR
     * @param {string} qrDecimal - The decimal string scanned from the QR code
     * @returns {Object|null} - Extracted data or null if decoding fails
     */
    static decodeSecureQR(qrDecimal) {
        try {
            // 1. Convert decimal string to Buffer
            const bigIntData = BigInt(qrDecimal);
            let hex = bigIntData.toString(16);
            if (hex.length % 2 !== 0) hex = '0' + hex;
            const compressedBuffer = Buffer.from(hex, 'hex');

            // 2. Decompress (Aadhaar V3/V4 uses GZip)
            let decompressed;
            try {
                decompressed = zlib.gunzipSync(compressedBuffer);
            } catch (e) {
                // Fallback for different compression types if necessary
                try {
                    decompressed = zlib.inflateSync(compressedBuffer);
                } catch (e2) {
                    decompressed = zlib.inflateRawSync(compressedBuffer);
                }
            }

            // 3. Extract Text Fields (First 18 fields as per V4 spec)
            const fields = [];
            let cursor = 0;
            // The delimiter is 0xFF (255)
            for (let i = 0; i < 18; i++) {
                const nextDelimiter = decompressed.indexOf(255, cursor);
                if (nextDelimiter === -1) break;
                fields.push(decompressed.slice(cursor, nextDelimiter));
                cursor = nextDelimiter + 1;
            }

            // 4. Extract Image and Signature
            // Signature is the last 256 bytes
            const signature = decompressed.slice(-256);
            // Image is everything between the text fields and the signature
            const imageBuffer = decompressed.slice(cursor, -256);

            // 5. Map Fields
            // V4 Mapping:
            // 0: QR Version
            // 3: Name
            // 4: DOB (DD-MM-YYYY)
            // 5: Gender
            // 6: Care Of (S/O, D/O etc)
            // 7: District/City
            // 10: Pardi Kande (Street/Locality?)
            // 11: Pincode
            // 12: VTC (Village/Town/City)
            // 13: State

            const data = {
                v: fields[0]?.toString(),
                name: fields[3]?.toString().trim(),
                dob: fields[4]?.toString().trim(),
                gender: fields[5]?.toString().trim(),
                careOf: fields[6]?.toString().trim(),
                district: fields[7]?.toString().trim(),
                pincode: fields[11]?.toString().trim(),
                vtc: fields[12]?.toString().trim(),
                state: fields[13]?.toString().trim(),
                maskedAadhar: fields[17]?.toString().trim(),
                image: imageBuffer,
                signature: signature
            };

            return data;
        } catch (error) {
            console.error("Aadhar Decoding Error:", error.message);
            return null;
        }
    }
}

export default AadharService;
