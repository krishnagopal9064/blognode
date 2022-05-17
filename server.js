const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const ejs=require('ejs')
const session = require('express-session');
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'krishna',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}));


const multer=require('multer')
app.use('/upload',express.static(path.join(__dirname,'upload')))
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.includes('png') ||
    file.mimetype.includes('jpg') ||
    file.mimetype.includes('jpeg')){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}
app.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('post_image'))


const userAuth = require("./middleware/userAuth");
const adminAuth = require("./middleware/adminAuth");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

const dbDriver="mongodb+srv://krishnagopali9064:u2ELxozp7Dlv2p80@cluster0.mgujx.mongodb.net/node_blog_new"

const userRoute = require("./route/userRoute");
const adminRoute=require('./route/adminRoute')

app.use(userAuth.authJwt);
app.use(adminAuth.authJwt);

app.use(userRoute);
app.use('/admin',adminRoute);

port = process.env.PORT || 10874;

mongoose.connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    app.listen(port, () => {
        console.log("Database Connected...");
        console.log(`Server Running At http://localhost:${port}`);
    })
}).catch(err => {
    console.log(err);
})