import { aj } from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 }); // requested:1 will be deducting 1 token from the bucket/request

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
            if (decision.reason.isBot()) res.status(403).json({ error: "Bot Detected" });
            return res.status(403).json({ error: "Access Denied" });
        }
        next();
    } catch (error) {
        console.error(`Arcjet middleware error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;