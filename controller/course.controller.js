import mongoose from "mongoose";
import User from "../models/course.model.js";
export const coursePage = async (req, res) => {
    try {
        const course = await Course.find({});
        console.log("📢 Courses from DB:", courses);
        res.render('./page/course/course', {
            title: 'Khóa học',
            course: courses
        });
    } catch (error) {
        console.error("🔥 Error fetching courses:", error);
        res.status(500).send('Lỗi server');
    }
};
