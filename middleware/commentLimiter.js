const rateLimit = require('express-rate-limit');

const commentLimiter = rateLimit({
    windowMs: parseInt(process.env.MIN_COMMENT_INTERVAL_SECONDS || '60', 10) * 1000,
    max: 1,
    message: {
        error: 'Занадто часто. Зачекайте перед наступним коментарем.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip
});

module.exports = commentLimiter;