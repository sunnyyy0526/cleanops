const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      role(["ward admin", "super admin"])
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
