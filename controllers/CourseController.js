const CourseModel = require('../models/course')

class CourseController{
    static createCourse =async(req,res)=>{
        try {
            const {courseTitle, category} = req.body;
            if(!courseTitle || !category) {
                return res.status(400).json({
                    message:"Course title and category is required."
                })
            }
    
            const course = await CourseModel.create({
                courseTitle,
                category,
                creator:req.id
            });
    
            return res.status(201).json({
                course,
                message:"Course created."
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message:"Failed to create course"
            })
        }
    }

    static getCreatorCourses =async(req,res)=>{
        try {
            const userId = req.id;
            const courses = await CourseModel.find({creator:userId});
            console.log(courses)
            if(!courses){
                return res.status(404).json({
                    courses:[],
                    message:"Course not found"
                })
            };
            return res.status(200).json({
                courses,
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message:"Failed to create course"
            })
        }
    }
    

}
module.exports =CourseController