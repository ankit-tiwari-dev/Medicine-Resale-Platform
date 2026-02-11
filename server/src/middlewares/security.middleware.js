import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";
import { v4 as uuidv4 } from "uuid";

// 1. Basic Security Headers
export const securityHeaders = helmet();

// 2. NoSQL Injection Prevention
export const sanitizeData = mongoSanitize();

// 3. XSS Prevention for all body inputs
export const xssClean = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = xss(req.body[key]);
            }
        }
    }
    next();
};

// 4. Request ID Tracing
export const requestId = (req, res, next) => {
    req.id = uuidv4();
    res.setHeader("X-Request-ID", req.id);
    next();
};

// 5. Rate Limiters
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 attempts per hour for sensitive auth routes
    message: "Too many login/verification attempts, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
});

export const kycLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // 5 KYC attempts per day to prevent spamming AI
    message: "KYC daily limit reached, please try again tomorrow",
    standardHeaders: true,
    legacyHeaders: false,
});
