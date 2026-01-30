import jwt from 'jsonwebtoken';

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
    );
};

export { generateAccessToken, generateRefreshToken };