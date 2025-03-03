import mongoose from "mongoose";
import Lesson from "../models/lesson.model.js";
import Course from "../models/course.model.js";
import { uploadVideo, deleteMediaById } from "../helper/upload-media.js";
// [GET] /course - Hiển thị danh sách khóa học
export const coursePage = async (req, res) => {
    try {
        const courses = await Course.find(); // Lấy tất cả khóa học
        console.log("📢 Courses from DB:", courses);
        res.render('./page/course/index', {
            title: 'Khóa học',
            courses: courses
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Không tìm thấy khóa học');
        res.redirect('back');
    }
};

// [GET] /course/:id - Hiển thị chi tiết khóa học
export const courseDetailPage = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate("lessons");

        if (!course) {
            req.flash('error', 'Khóa học không tìm thấy');
            return res.redirect('/course');
        }

        // Lấy danh sách các khóa học liên quan
        const relatedCourses = await Course.find({
            _id: { $ne: courseId }, // Không lấy chính khóa học này
            language: course.language, // Lấy các khóa học có cùng ngôn ngữ
        }).limit(4); // Giới hạn số lượng

        console.log("📢 Course from DB:", course);


        res.render("./page/course/detail", {
            title: course.name,
            course: course,
            relatedCourses: relatedCourses
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Không tìm thấy khóa học');
        res.redirect('/course');
    }
};

// [GET] /course/:courseId/lesson/:lessonId - Hiển thị bài học cụ thể


export const lessonDetailPage = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        // Tìm khóa học có danh sách bài học
        const course = await Course.findById(courseId).populate("lessons");
        if (!course) {
            req.flash('error', 'Khóa học không tồn tại.');
            return res.redirect('/course');
        }

        // Tìm bài học theo ID
        const lesson = course.lessons.find(lesson => lesson._id.toString() === lessonId);
        if (!lesson) {
            req.flash('error', 'Bài học không tồn tại.');
            return res.redirect(`/course/${courseId}`);
        }
        console.log(" Lesson from DB:", lesson);
        res.render('page/course/lesson', {
            title: lesson.title,
            lesson: lesson,
            course: course
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Không tìm thấy bài học');
        res.redirect('back');
    }
};

export const createCourse = async (req, res) => {
    try {
        const { name, language, decription, price } = req.body;
        const newCourse = new Course({
            name,
            language,
            decription,
            price
        })
        await newCourse.save();
        res.status(200).json({ message: 'Thêm khóa học thanh cong' });
    } catch (error) {
        res.status(500).json({ error: 'Loi khi tao khóa học' });
    }
}

export const addLessonVideo = async (req, res) => {
    try {
        const { courseId, title, content } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'File is required' });
        }
        const videoUrl = await uploadVideo(file);
        const newLesson = new Lesson({
            title,
            type: 'video',
            content,
            videoUrl: videoUrl
        });
        await newLesson.save();
        const course = await Course.findById(courseId);
        course.lessons.push(newLesson._id);
        await course.save();

        res.status(200).json({ message: 'Them video thanh cong' });
    } catch (error) {
        res.status(500).json({ error: 'Loi khi them video' });
    }
}
export const deleteLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        // Tìm và xóa bài học
        const lesson = await Lesson.findByIdAndDelete(lessonId);
        if (!lesson) {
            return res.status(404).json({ error: 'Bài học không tồn tại' });
        }

        // Cập nhật danh sách bài học trong khóa học
        await Course.findByIdAndUpdate(courseId, { $pull: { lessons: lessonId } });

        res.status(200).json({ message: 'Xóa bài học thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa bài học' });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Tìm và xóa khóa học
        const course = await Course.findByIdAndDelete(courseId);


        if (!course) {
            return res.status(404).json({ error: 'Khóa học không tồn tại' });
        }

        // Xóa tất cả bài học liên quan
        await Lesson.deleteMany({ _id: { $in: course.lessons } });

        res.status(200).json({ message: 'Xóa khóa học thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa khóa học' });
    }
};

