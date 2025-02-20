import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['video', 'task'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    jsonTask: {
        type: String,
    }
    ,
    videoUrl: {
        type: String,
    }
});
const Lesson = mongoose.model(`Lesson`, lessonSchema);
export default Lesson;