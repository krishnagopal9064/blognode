const UserModel = require("../model/user");

exports.checkDuplicateEntries = (req, res, next) => {
   UserModel.findOne({
            email: req.body.email
        }).exec((err, email) => {
            if (err) {
                console.log(err);
                return;
            }
            if (email) {
                req.flash("message", "Email Already Exists");
                return res.redirect("/register");
            }
            const password = req.body.password;
            const confirm = req.body.cpassword;
            if (password !== confirm) {
                req.flash("message", "Password & Confirm Password Are Not Matched");
                return res.redirect("/register");
            }
            next();
        })

}


const jwt = require("jsonwebtoken");
exports.authJwt = (req, res, next) => {
    if (req.cookies && req.cookies.userToken) {
        jwt.verify(req.cookies.userToken, "krishna_1999#2022@", (err, data) => {
            req.user = data
            next()
        })
    } else {
        next()
    }
}
