import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        // Use userId if available, otherwise fallback to IP address
        const userId = req.user?.id;
        const identifier = userId || req.ip;

        const { success } = await ratelimit.limit(`rate-limit-${identifier}`);

        if (!success) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }

        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default rateLimiter;