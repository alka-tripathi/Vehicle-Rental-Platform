// const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   try {

//     // Get token from cookie
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         message: "Not authenticated"
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Store user information in request
//     req.user = {
//       userId: decoded.userId,
//       role: decoded.role
//     };

//     next();

//   } catch (error) {

//     return res.status(401).json({
//       message: "Invalid or expired token"
//     });

//   }
// };

// module.exports = protect;

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = protect;
