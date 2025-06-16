import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        // Later with userId or IP address
        const {succes} = await ratelimit.limit("my-rate-limit")

        if (!succes) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }

        next();
    } catch (error) {
        console.error("Rate limiter error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default rateLimiter;