
import Post from '../models/post.model.js'; 
import Comment from '../models/comment.model.js';
import {  uploadImage } from '../helper/upload-media.js';

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
export const createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
            }
            
            console.log("Request Body:", req.body);
            console.log("Uploaded File:", req.file);

            const { caption, desc } = req.body;
            const img = req.file;
            
            if (!img) {
                return res.status(400).json({ message: "Vui lòng tải lên một hình ảnh" });
            }
            const imgUrl = await uploadImage(img);
            const newPost = new Post({
                caption,
                desc,
                img: imgUrl,
                author: req.user._id, 
            });
        
            await newPost.save();
            res.redirect('/community');
        } catch (error) {
            console.error('Lỗi đăng bài:', error);
            res.status(500).send('Lỗi máy chủ');
        }
};




