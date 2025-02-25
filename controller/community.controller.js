
import Post from '../models/post.model.js'; // Import model bài viết
import Comment from '../models/comment.model.js'; // Import model bình luận

export const getCommunity = async (req, res) => {
    try {
        // Lấy tất cả bài viết, sắp xếp theo thời gian mới nhất và lấy đầy đủ thông tin liên quan
        const posts = await Post.find()
            .populate("author", "username avatar") // Lấy thông tin tác giả
            .populate({
                path: "comments",
                populate: { path: "author", select: "username avatar" } // Lấy thông tin tác giả của bình luận
            })
            .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên đầu
            .exec();
        //const user = req.session.user || null; 
        console.log("posts", posts);
        //console.log("user", user);

        res.render("./page/community/community", {
            title: "Cộng đồng",
            posts, // Truyền danh sách bài viết về Pug
            //user,
        });

    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};



