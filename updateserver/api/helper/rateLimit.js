const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');

exports.rate = async (req, res,next) => {

    try {
        db = await mongoose.connection
    } catch (error) {

    }

    const opts = {
        storeClient: db,
        points: 10, 
        duration: 1,
        blockDuration: 120,
    };

    const rateLimiterMongo = new RateLimiterMongo(opts);
    rateLimiterMongo.consume(req.ip) // consume 2 points
        .then((rateLimiterRes) => {
      next()
        })
        .catch((rateLimiterRes) => {
            // Not enough points to consume
            res.status(429).send('Too Many Requests');


        });
}