import mongoose from "mongoose";
import Course from "../models/course.model.js";
export const coursePage = async (req, res) => {
    try {
        const courses = await Course.find({ _id: { $ne: res.locals.user._id } }).select('-password');
        console.log("📢 Courses from DB:", courses);
        res.render('./page/course/course', {
            title: 'Khóa học',
            courses: courses
        });
    } catch (error) {
        console.error("🔥 Error fetching course:", error);
        res.status(500).send('Lỗi server');
    }
};
