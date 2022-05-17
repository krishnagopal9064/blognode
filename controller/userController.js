const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path')
const UserModel = require("../model/user");
const TokenModel = require("../model/token");
const ContactModel=require('../model/contact')
const BlogModel=require('../model/blogModel')
const AboutModel=require("../model/about")

exports.index = (req, res) => {
    const pager = req.query.page ? req.query.page : 1
    const options = {
        page: pager,
        limit: 2,
        collation: {
          locale: 'en',
        },
      };
        BlogModel.paginate({}, options).then(function (data) {
            if(data){
                //console.log(data)
                res.render('user/index',{
                    title:"Blog || Home", 
                    data:data,
                    message:req.flash('message'),
                    pager: pager
                })
            }    
        }).catch(err=>{
            console.log(err);
        })
}
exports.about = (req, res) => {
    AboutModel.find((err,data)=>{
        if(!err){
            res.render('user/about',{
                viewdata:data,
                message:req.flash('message'),
                title:"Blog || About"
            })
        }
    })
}
exports.contact = (req, res) => {
    res.render("user/contact", {
        message:req.flash('message'),
        title: "Blog || Contact"
    })
}

exports.post_contact = (req, res) => {
    ContactModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message
    }).save((err, user) => {
        if (!err) {
            console.log("Message Sent Successfully...");
            req.flash("message", "Message Sent Successfully...");
            res.redirect("/contact");
        } else {
            console.log("Message sending failed...", err);
            req.flash("message", "Message sending failed..");
        }
    })
}

exports.login = (req, res) => {
    loginData = {}
    loginData.email = (req.cookies.email) ? req.cookies.email : undefined
    loginData.password = (req.cookies.password) ? req.cookies.password : undefined
    res.render("user/login", {
        title: "Blog || Login",
        message: req.flash('message'),
        data: loginData
    })
}
exports.register = (req, res) => {
    res.render("user/register", {
        title: "Blog || Register",
        message: req.flash('message')
    })
}
exports.signup = (req, res) => {
    UserModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            console.log("User Added Successfully...");
            req.flash("message", "User Added");
            res.redirect("/login");
        } else {
            console.log("User Not Added...", err);
        }
    })
}

exports.signin = (req, res, next) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            const hashPassword = data.password;
            if (bcrypt.compareSync(req.body.password, hashPassword)) {
                const userToken = jwt.sign({
                    id: data._id,
                    name: data.name
                }, "krishna_1999#2022@", { expiresIn: '6000s' });
                res.cookie("userToken", userToken);
                if (req.body.rememberme) {
                    res.cookie('email', req.body.email)
                    res.cookie('password', req.body.password)
                }
                console.log(data);
                res.redirect("/");
            } else {
                req.flash("message", "Invalid Password");
                res.redirect("/login");
            }

        } else {
            console.log(err);
            req.flash("message", "Invalid Email");
            res.redirect("/login");
        }
    })
}
exports.userAuth = (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        res.redirect("/login");
    }
}
exports.userDashboard = (req, res) => {
    if (req.user) {
        UserModel.find({}, function(err, userDetails) {
            if (!err) {
                res.render("user/user_dashboard", {
                    title: "User || Dashboard",
                    data: req.user,
                    details: userDetails
                })
            } else {
                console.log(err);
            }
        })
    }
}

exports.create = (req, res) => {
    if (req.user) {
        let data=req.user
        UserModel.find({}, function(err, userDetails) {
            if (!err) {
                res.render("user/create", {
                    title: "Create Post",
                    data: data,
                    details: userDetails
                })
            } else {
                console.log(err);
            }
        })
    }
}

exports.create_post=(req,res)=>{
    const post_image=req.file
    const BlogModels=new BlogModel({
        post_title:req.body.post_title,
        post_subtitle:req.body.post_subtitle,
        editor1:req.body.editor1,
        post_image: post_image.path,
        name:req.body.name,
        email:req.body.email,
        status: 1
    })
    BlogModels.save().then((result)=>{
        console.log(result,"Post Created Successfully");
        req.flash('message','Post Created Successfully')
        res.redirect('/user_dashboard')
    }).catch((err)=>{
        console.log(err,"add failed");
    })
}


exports.post_details=(req,res)=>{
    if (req.user) {
        const blog_id=req.params.u_id
        BlogModel.findById(blog_id).then((result)=>{
            console.log(result);
            res.render('user/post_details',{
                data:result,
                title:"Blog || Post Details",
                details:req.user
            })
        }).catch(err=>{
            console.log(err);
        })
    }
}


exports.logout = (req, res) => {
    res.clearCookie("userToken");
    res.redirect("/login");
}