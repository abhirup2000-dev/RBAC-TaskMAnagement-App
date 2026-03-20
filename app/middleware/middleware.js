const jwt = require("jsonwebtoken");

// Role-based permissions map
const ROLE_PERMISSIONS = {
  admin: ["create_record", "read_record", "update_record", "delete_record"],
  manager: ["create_record", "read_record", "update_record"],
  employee: ["create_record", "read_record"],
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.body?.token ||
    req.query?.token ||
    req.headers["authorization"] ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log("Auth done:", req.user.empEmail, "| role:", req.user.role);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  return next();
};

// Permission middleware factory — checks if req.user has the required permission
const authorizePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: not logged in",
      });
    }

    const permissions = ROLE_PERMISSIONS[req.user.role] || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: '${req.user.role}' role does not have '${requiredPermission}' permission`,
      });
    }

    next();
  };
};

// View middleware — sets req.user from cookie token without throwing (for EJS views)
const setUserFromCookie = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user.permissions = ROLE_PERMISSIONS[req.user.role] || [];
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

//redirects to login if not authenticated
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  authMiddleware,
  authorizePermission,
  setUserFromCookie,
  requireAuth,
  ROLE_PERMISSIONS,
};
