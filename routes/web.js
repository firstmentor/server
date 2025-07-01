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

route.post('/admin/register', AdminController.register);
route.post('/admin/login', AdminController.login);
route.get('/admin/dashboard', verifyAdmin, AdminController.dashboard);
route.post('/admin/logout', AdminController.logout);
route.get('/admin/profile', verifyAdmin, AdminController.profile);
route.get('/admin/stats', verifyAdmin, StatsController.getStats);



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
route.post('/apply', upload.single('resume'), JobApplicationController.apply);
route.get('/allJob', JobApplicationController.getAllApplications);
route.put('/application/:id/status', JobApplicationController.updateStatus);
route.delete('/application/:id', JobApplicationController.delete);












module.exports = route;
