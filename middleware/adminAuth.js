const jwt = require("jsonwebtoken");
exports.authJwt = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken, "krishna_1999_&_#2022@", (err, data) => {
            req.admin = data
            next()
        })
    } else {
        next()
    }
}
