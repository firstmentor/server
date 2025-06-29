const express = require("express");
const UserController = require("../controllers/UserController");
const route = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated')
const CourseController = require("../controllers/CourseController.js");
const JobApplicationController = require('../controllers/JobApplicationController');
const upload1 = require('../middleware/multer');
const upload = require('../middleware/upload');




route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.get("/logout", UserController.logOut);
route.get("/profile",isAuthenticated, UserController.getUserProfile);
route.put("/profile/update",isAuthenticated, upload1.single("profilePhoto"), UserController.updateProfile);


//courseController
route.post("/createCourse",isAuthenticated, CourseController.createCourse);
route.get("/getCourse",isAuthenticated, CourseController.getCreatorCourses);




//job
route.post('/apply', upload.single('resume'), JobApplicationController.apply);
route.get('/allJob', JobApplicationController.getAllApplications);
route.put('/application/:id/status', JobApplicationController.updateStatus);
route.delete('/application/:id', JobApplicationController.delete);












module.exports = route;
