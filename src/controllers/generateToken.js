import jwt from "jsonwebtoken"

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username }, // Payload (avoid sensitive data)
    process.env.JWT_SECRET, // Use a strong, long secret key
    {
      expiresIn: '24h', // Set expiration time (short-lived)
      algorithm: 'HS256', // HMAC SHA-256 encryption
    }
  );
};
export default generateToken