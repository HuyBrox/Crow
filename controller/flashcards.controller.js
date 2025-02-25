import Course from "../models/course.model.js";

export const getflashcards = async (req, res) => {
    try {
        console.log(Course);
        // Lấy danh sách các khóa học chứa flashcards
        const courses = await Course.find().select("name wordCount description");

        res.render("./page/flashcards/flashcards", {
            title: "Thẻ Học Tập",
            courses: courses, // Gửi dữ liệu xuống giao diện Pug
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách flashcards:", error);
        res.status(500).send("Lỗi server");
    }
};
