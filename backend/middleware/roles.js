export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden"
    });
  }

  next();
};

export const verifyEmployee = (req, res, next) => {
  if (req.user.role !== "employee" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden"
    });
  }

  next();
}

