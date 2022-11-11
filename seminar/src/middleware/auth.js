const authMiddleware = (req, res, next) => {
    const {username, password} = req.body.credential;
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;