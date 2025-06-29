const express = require("express");
const UserController = require("../controllers/UserController");
const route = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated')
const CourseController = require("../controllers/CourseController.js");
const JobApplicationController = require('../controllers/JobApplicationController');
const upload1 = require('../middleware/multer');
const upload = require('../middleware/upload');

const AdminController = require('../controllers/AdminController');
const verifyAdmin = require('../middleware/verifyAdmin.js');

route.post('/admin/register', AdminController.register);
route.post('/admin/login', AdminController.login);
route.get('/admin/dashboard', verifyAdmin, AdminController.dashboard);
route.post('/admin/logout', AdminController.logout);



//job
route.post('/apply', upload.single('resume'), JobApplicationController.apply);
route.get('/allJob', JobApplicationController.getAllApplications);
route.put('/application/:id/status', JobApplicationController.updateStatus);
route.delete('/application/:id', JobApplicationController.delete);












module.exports = route;
