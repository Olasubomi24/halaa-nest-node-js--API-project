
import { StatusCodes } from 'http-status-codes';
import 'dotenv/config';


const apiKey = process.env.X_API_KEY;

const apiKeyMiddleware = (req, res, next) => {
    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader && apiKeyHeader === apiKey) {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid API Key' });
    }
};

export default apiKeyMiddleware;