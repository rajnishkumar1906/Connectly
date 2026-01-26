// A JWT contain three things - HEADER , PAYLOAD AND SIGNATURE
// Only server can create jwt . If payload is changed , signature will break
// JWT authentication and authorization is stateless

import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Login required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);            //jwt secret key is matched from req and user_id is extracted 
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
