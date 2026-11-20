export const isAdmin = (req, res, next) => {
  if (!req.session?.user || req.session.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  return next();
};