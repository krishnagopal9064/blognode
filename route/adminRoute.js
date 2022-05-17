const Route = require("express").Router();
const adminController = require("../controller/adminController");
const userAuth=require('../middleware/adminAuth')

Route.get('/login' , adminController.admin_login)
Route.post("/signin", adminController.admin_signin);
// Route.get('/register' , adminController.admin_register)
// Route.post("/signup", adminController.admin_signup);

Route.get('/admin_index' , adminController.adminAuth , adminController.admin_index)
Route.get('/admin_about' , adminController.adminAuth , adminController.admin_about)
Route.get('/admin_add_about' ,adminController.adminAuth , adminController.admin_add_about)
Route.post('/add_about', adminController.adminAuth,adminController.add_about)
Route.get('/admin_post', adminController.adminAuth ,adminController.admin_allPost)
Route.get('/deletecontact/:u_id',adminController.deletecontact)
Route.get('/deleteallpost/:u_id',adminController.deleteallpost)
Route.get('/deleteabout/:u_id',adminController.deleteabout)
Route.get('/deleteuser/:u_id',adminController.deleteuser)
Route.get('/admin_contact',adminController.adminAuth,adminController.admin_contact)
Route.get('/users',adminController.adminAuth,adminController.users)
Route.get('/logout',adminController.logout)



module.exports=Route