//course
export const getcourse= async (req, res) => {
    if (res.locals.user) {
        const allUsers = await User.find({ _id: { $ne: res.locals.user._id } }).select('-password');
        res.render('./page/course/course', {
            title: 'Học Tập',
            allUsers: allUsers,
        });
        return;
    }
    res.render('./page/course/course', {
        title: 'Học Tập',
    });
}