const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/admin");
const AdminModel = require("../model/admin");
const TokenModel = require("../model/adminToken");
const BlogModel=require("../model/blogModel")
const ContactModel=require("../model/contact")
const User=require("../model/user")
const AboutModel=require("../model/about")

exports.admin_login = (req, res) => {
    res.render("admin/admin_login", {
        title: "Admin Login",
        message: req.flash('message'),
    })
}

exports.admin_register = (req, res) => {
    res.render("admin/register", {
        title: "Admin Register"
    })
}

exports.admin_signup = (req, res) => {
    AdminModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            console.log("User Added Successfully...");
            req.flash("message", "User Added");
            res.redirect("/admin/login");
        } else {
            console.log("User Not Added...", err);
        }
    })
}

exports.admin_signin = (req, res, next) => {
    AdminModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            const hashPassword = data.password;
            if (bcrypt.compareSync(req.body.password, hashPassword)) {
                const adminToken = jwt.sign({
                    id: data._id,
                    name: data.name
                }, "krishna_1999_&_#2022@", { expiresIn: '6000s' });
                res.cookie("adminToken", adminToken);
                console.log(data);
                res.redirect("/admin/admin_index");
            } else {
                req.flash("message", "Invalid Password");
                res.redirect("/admin/login");
            }

        } else {
            console.log(err);
            req.flash("message", "Invalid Email");
            res.redirect("admin/login");
        }
    })
}
exports.adminAuth = (req, res, next) => {
    if (req.admin) {
        console.log(req.admin);
        next();
    } else {
        console.log(req.admin);
        res.redirect("/admin/login");
    }
}
exports.admin_index = (req, res) => {
    if (req.admin) {
        AdminModel.find({}, function(err, userDetails) {
            if (!err) {
                res.render("admin/admin_index", {
                    title: "Admin Dashboard",
                    data: req.admin,
                    details: userDetails
                })
            } else {
                console.log(err);
            }
        })
    }
}
exports.admin_about = (req, res) => {
    if (req.admin) {
        AboutModel.find({}, function(err, data) {
            if (!err) {
                res.render("admin/admin_about", {
                    title: "Admin About",
                    viewdata: req.admin,
                    details: data
                })
            } else {
                console.log(err);
            }
        })
    }
}
exports.admin_add_about = (req, res) => {
    if (req.admin) {
        AdminModel.find({}, function(err, userDetails) {
            if (!err) {
                res.render("admin/admin_Add_about", {
                    title: "Admin Add About",
                    data: req.admin,
                    details: userDetails
                })
            } else {
                console.log(err);
            }
        })
    }
}
exports.add_about=(req,res)=>{
    AboutModel({
        about: req.body.editor1
    }).save((err, data) => {
        if (!err) {
            console.log("About Added Successfully...");
            req.flash("message", "About Added");
            res.redirect("/admin/admin_about");
        } else {
            console.log("About Not Added...", err);
        }
    })
}

exports.admin_allPost=(req,res)=>{
    if (req.admin) {
        BlogModel.find({}, function(err, details) {
            if (!err) {
                res.render("admin/admin_allPost", {
                    title: "Admin Add About",
                    viewdata: details
                })
            } else {
                console.log(err);
            }
        })
    }
}

exports.admin_contact=(req,res)=>{
    if (req.admin) {
        ContactModel.find({}, function(err, details) {
            if (!err) {
                res.render("admin/admin_contact", {
                    title: "Admin Add About",
                    viewdata: details
                })
            } else {
                console.log(err);
            }
        })
    }
}

exports.users=(req,res)=>{
    if (req.admin) {
        User.find({}, function(err, details) {
            if (!err) {
                res.render("admin/users", {
                    title: "All Users",
                    viewdata: details
                })
            } else {
                console.log(err);
            }
        })
    }
}

exports.deletecontact=(req,res)=>{
    const userid=req.params.u_id
    ContactModel.deleteOne({_id:userid}).then(deletedata=>{
        console.log(deletedata,"Delete Successfully");
        res.redirect('/admin/admin_contact')
    }).catch((err)=>{
        console.log(err,"Delete Failed");
    })
}

exports.deleteallpost=(req,res)=>{
    const userid=req.params.u_id
    BlogModel.deleteOne({_id:userid}).then(deletedata=>{
        console.log(deletedata,"Delete Successfully");
        res.redirect('/admin/admin_post')
    }).catch((err)=>{
        console.log(err,"Delete Failed");
    })
}

exports.deleteabout=(req,res)=>{
    const userid=req.params.u_id
    AboutModel.deleteOne({_id:userid}).then(deletedata=>{
        console.log(deletedata,"Delete Successfully");
        res.redirect('/admin/admin_about')
    }).catch((err)=>{
        console.log(err,"Delete Failed");
    })
}

exports.deleteuser=(req,res)=>{
    const userid=req.params.u_id
    User.deleteOne({_id:userid}).then(deletedata=>{
        console.log(deletedata,"Delete Successfully");
        res.redirect('/admin/users')
    }).catch((err)=>{
        console.log(err,"Delete Failed");
    })
}

exports.logout = (req, res) => {
    res.clearCookie("adminToken");
    res.redirect("/admin/login");
}