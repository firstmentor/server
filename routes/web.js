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
const StatsController = require("../controllers/StatsController.js");
const RequirementController = require("../controllers/RequirementController.js");
const JobController = require("../controllers/JobController.js");
const ProductController = require("../controllers/productController.js");
const CategoryController = require("../controllers/CategoryController.js");
const ContactController = require("../controllers/contactController.js");

route.post('/admin/register', AdminController.register);
route.post('/admin/login', AdminController.login);
route.get('/admin/dashboard', verifyAdmin, AdminController.dashboard);
route.post('/admin/logout', AdminController.logout);
route.get('/admin/profile', verifyAdmin, AdminController.profile);
route.get('/admin/stats', verifyAdmin, StatsController.getStats);
route.put("/admin/change-password", verifyAdmin, AdminController.changePassword);
route.post("/admin/forgot-password", AdminController.forgotPassword);
route.post("/admin/reset-password", AdminController.resetPassword);




//RequirementController
route.post('/requirement', RequirementController.submit);
route.get('/allrequirement',RequirementController.getAll);
route.delete('/deleterequirement/:id', RequirementController.delete);


//JobController
route.post('/addjob', JobController.addJob);
route.get('/jobs', JobController.getJobs);
route.delete('/job/:id', JobController.deleteJob);     // ✅ Delete API
route.put('/job/:id', JobController.updateJob);  


//job
route.post('/apply',  JobApplicationController.apply);
route.get('/allJob', JobApplicationController.getAll);
route.put('/application/:id/status', JobApplicationController.updateStatus);
route.delete('/application/:id', JobApplicationController.delete);


//CategoryController
route.get("/category", CategoryController.getAll);
route.post("/createCategory", CategoryController.create);
route.put("/categoryUpdate/:id", CategoryController.update);
route.delete("/categoryDelete/:id", CategoryController.delete);




route.post('/contact', ContactController.create);
route.get('/contact', ContactController.getAll);
route.delete('/contact/:id', ContactController.delete);
// ✅ Bulk Delete Route
route.post('/contact/bulk-delete', ContactController.bulkDelete);






route.post('/upload', ProductController.create);













module.exports = route;
