import User from '../models/user.model.js';
import FlashCard from '../models/flash-card.model.js';

//flashcards
export const getflashcards = async (req, res) => {
    if (res.locals.user) {
        const allUsers = await User.find({ _id: { $ne: res.locals.user._id } }).select('-password');
        res.render('./page/flashcards/flashcards', {
            title: 'Thẻ Học Tập',
            allUsers: allUsers,
        });
        return;
    }
    res.render('./page/flashcards/flashcards', {
        title: 'Bộ thẻ học tập',
    });
}
//thẻ học tập chi tiết
export const getflashcardDetail = async (req, res) => {

    res.render('./page/flashcards/latthe', {
        title: 'Thẻ học tập',
    });
}