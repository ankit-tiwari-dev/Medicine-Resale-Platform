import cloudinary from "../config/cloudinary.js";

/**
 * Shared Cloudinary upload helper.
 * In test mode, returns a mock URL to avoid hitting the Cloudinary API.
 * 
 * @param {Buffer} buffer - File buffer to upload
 * @param {string} folder - Cloudinary folder name
 * @param {string} filename - Original filename (used for public_id)
 * @param {string} resourceType - Resource type (default: "image")
 * @returns {Promise<string>} Cloudinary secure URL
 */
export const uploadToCloudinary = (buffer, folder, filename, resourceType = "image") => {
    if (process.env.NODE_ENV === 'test') {
        return Promise.resolve(`https://res.cloudinary.com/test/${folder}/upload/${filename}`);
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: `${folder}_${Date.now()}_${filename}`,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Full upload result variant — returns the full Cloudinary result object.
 * Used when you need more than just the secure_url (e.g., public_id, format, etc.)
 */
export const uploadToCloudinaryFull = (buffer, folder, filename) => {
    if (process.env.NODE_ENV === 'test') {
        return Promise.resolve({ secure_url: `https://res.cloudinary.com/test/${folder}/upload/${filename}` });
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, public_id: filename },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};
