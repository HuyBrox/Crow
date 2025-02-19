//flashcards
export const getflashcards= async (req, res) => {
    if (res.locals.user) {
        const allUsers = await User.find({ _id: { $ne: res.locals.user._id } }).select('-password');
        res.render('./page/flashcards/flashcards', {
            title: 'Thẻ Học Tập',
            allUsers: allUsers,
        });
        return;
    }
    res.render('./page/flashcards/flashcards', {
        title: 'Thẻ Học Tập',
    });
}