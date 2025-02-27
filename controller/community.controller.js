
import Post from '../models/post.model.js'; 
import Comment from '../models/comment.model.js';
import {  uploadImage } from '../helper/uploadMedia.js';

// Hiển thị trang cộng đồng
export const getCommunity = async (req, res) => {
    try {
        // Lay bai viet
        const posts = await Post.find()
            .populate("author", "username avatar") 
            .populate({
                path: "comments",
                populate: { path: "author", select: "username avatar" } 
            })
            .sort({ createdAt: -1 }) 
            .exec();
        //const user = req.session.user || null;
        console.log("posts", posts);
        //console.log("user", user);

        res.render("./page/community/community", {
            title: "Cộng đồng",
            posts, 
            //user,
        });

    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};





