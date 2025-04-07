const setTokenCookie = (res, token) => {
    res.cookie('authToken', token, {
      httpOnly: true, // Prevents access via JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'None', // Protects against CSRF attacks
      maxAge: 3600000, // Token expiration (1 hour)
    });
  };

export default setTokenCookie