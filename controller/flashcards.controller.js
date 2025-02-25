<<<<<<< HEAD
import User from '../models/user.model.js';
import FlashCard from '../models/flash-card.model.js';

//flashcards
export const getflashcards = async (req, res) => {
    try {
        const user = res.locals.user;
        const flashCardSets = await FlashCard.find({ user: user._id });
        res.render('./page/flashcards/index', {
            title: 'Thẻ học tập',
            flashCardSets,
        });
    } catch (error) {

    }
}
//thêm thẻ
export const newCard = async (req, res) => {
    try {
        const user = res.locals.user;
        const id = req.params.id;
        const { vocabulary, meaning } = req.body;
        const flashCard = await FlashCard.findOne({ _id: id, user: user._id });
        if (!flashCard) {
            throw new Error('Không tìm thấy bộ thẻ!');
        }
        flashCard.cards.push({ vocabulary, meaning });
        await flashCard.save();
        req.flash('success', 'Thêm thẻ thành công!');
        return res.status(200).json({ message: 'Thêm thẻ thành công!' });
    } catch (error) {

    }
}
//thẻ học tập chi tiết
export const getflashcardDetail = async (req, res) => {

    try {
        const user = res.locals.user;
        const cardId = req.params.id;
        const flashCard = await FlashCard.findOne({ _id: cardId, user: user._id });
        if (!flashCard) {
            req.flash('error', 'Không tìm thấy bộ thẻ!');
            return res.redirect('/flashcards');
        }
        res.render('./page/flashcards/card', {
            title: "Thẻ " + flashCard.name,
            flashCard,
        });
    } catch (error) {
        req.flash('error', 'Có lỗi khi tải bộ thẻ!');
        res.redirect('/flashcards');
    }
}
export const getCreateCard = (req, res) => {
    res.render('./page/flashcards/createCard', {
        title: 'Tạo bộ thẻ mới',
        name: '',
        cardsText: ''
    });
};

export const postCreateCard = async (req, res) => {
    try {
        const user = res.locals.user;
        const { name, cardsText } = req.body;
        let cards = [];

        if (cardsText) {
            cards = cardsText.trim().split('\n').map(line => {
                const [vocabulary, meaning] = line.split('-').map(item => item.trim());
                return { vocabulary, meaning };
            }).filter(card => card.vocabulary && card.meaning);
        }

        if (!name || cards.length === 0) {
            throw new Error('Vui lòng nhập tên bộ thẻ và ít nhất một thẻ hợp lệ!');
        }

        const flashCard = new FlashCard({
            name,
            cards,
            user: user._id,
        });

        await flashCard.save();
        req.flash('success', 'Tạo bộ thẻ thành công!');
        res.redirect('/flashcards');
    } catch (error) {
        req.flash('error', error.message || 'Có lỗi khi tạo bộ thẻ');
        res.render('./page/flashcards/createCard', {
            title: 'Tạo bộ thẻ mới',
            name: req.body.name || '',
            cardsText: req.body.cardsText || ''
        });
    }
};

//xóa thẻ và xóa bộ thẻ
export const deleteCard = async (req, res) => {
    try {
        const user = res.locals.user;
        const cardId = req.params.id;
        const flashCard = await FlashCard.findOne({ 'cards._id': cardId, user: user._id });
        if (!flashCard) {
            throw new Error('Không tìm thấy thẻ!');
        }
        flashCard.cards = flashCard.cards.filter(card => card._id.toString() !== cardId);
        await flashCard.save();
        req.flash('success', 'Xóa thẻ thành công!');
        res.redirect('/flashcards');
    } catch (error) {
        req.flash('error', 'Có lỗi khi xóa thẻ!');
        res.redirect('/flashcards');
    }
};
export const deleteFlashCard = async (req, res) => {
    try {
        const user = res.locals.user;
        console.log('User:', user);
        if (!user || !user._id) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/flashcards');
        }

        const flashCardId = req.params.id;
        console.log('Flashcard ID:', flashCardId);

        const flashCard = await FlashCard.findOne({ _id: flashCardId, user: user._id });
        console.log('Found flashcard:', flashCard);
        if (!flashCard) {
            req.flash('error', 'Không tìm thấy bộ thẻ!');
            return res.redirect('/flashcards');
        }

        await flashCard.deleteOne();
        console.log('Flashcard deleted');

        req.flash('success', 'Xóa bộ thẻ thành công!');
        return res.redirect('/flashcards');
    } catch (error) {
        console.error('Error in deleteFlashCard:', error);
        req.flash('error', 'Có lỗi khi xóa bộ thẻ!');
        return res.redirect('/flashcards');
    }
};
=======
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
>>>>>>> origin/huuky
