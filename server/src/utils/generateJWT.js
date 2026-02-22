import jwt from 'jsonwebtoken';

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

export { generateAccessToken, generateRefreshToken };