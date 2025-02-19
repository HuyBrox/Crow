import mongoose from "mongoose";
import User from "../models/user.model.js";

const flashCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    card: [
        {
            vocabulary: {
                type: String,
                required: true,
            },
            meaning: {
                type: String,
                required: true,
            },
        }
    ],
    language: {
        type: String,
        required: true,
        enum: ['en', 'vi', 'jp'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    }
}, { timestamps: true });

const FlashCard = mongoose.model("FlashCard", flashCardSchema);
export default FlashCard;