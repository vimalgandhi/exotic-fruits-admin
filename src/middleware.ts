import { Request, Response, NextFunction } from 'express';

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Validate the token (mockup for demonstration)
    if (token !== 'your-valid-token') {
        return res.status(403).json({ message: 'Invalid token.' });
    }

    next(); // Proceed to the next middleware or route
};
