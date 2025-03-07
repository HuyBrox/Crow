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
    },
    notes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Tham chiếu đến model User
            required: true,
        },
        content: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }]
});
const Lesson = mongoose.model(`Lesson`, lessonSchema);
export default Lesson;