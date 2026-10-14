export const checkAuth = (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({
            success: true,
            isLoggedIn: true,
            user: req.session.user,
            isAdmin: req.session.user.email === process.env.ADMIN_EMAIL
        });
    }
    return res.status(200).json({
        success: true,
        isLoggedIn: false,
        user: null
    });
};
