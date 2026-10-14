export const isAuthenticated = (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: "User not logged in"
            });
        }
        req.isAuthenticated = true;
        req.isAdmin = req.session.user.email === process.env.ADMIN_EMAIL;

        return next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
