const Route = require("express").Router();
const userController = require("../controller/userController");
const userAuth=require('../middleware/userAuth')

Route.get('/',userController.index)
Route.get('/about',userController.about)
Route.get('/contact',userController.contact)
Route.post('/post_contact',userController.post_contact)
Route.get('/login',userController.login)
Route.get('/register',userController.register)
Route.post("/signup", [userAuth.checkDuplicateEntries], userController.signup);
Route.post("/signin", userController.signin);
Route.get("/user_dashboard", userController.userAuth, userController.userDashboard);
Route.get('/create',userController.userAuth,userController.create)
Route.get('/post_details/:u_id', userController.userAuth, userController.post_details)
Route.post('/create_post',userController.create_post)
// Route.post('/comment',userController.userAuth, userController.comment )

Route.get('/logout',userController.logout)


module.exports=Route
