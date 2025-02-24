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