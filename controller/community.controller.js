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
            user: req.user || null, // Truyền user từ middleware requireAuth
        });

    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};

//Tao bai viet
export const createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
            }
            
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
            
            res.status(200).json({ message: "Đăng bài thành công!", post: newPost })
            res.redirect('/community');
        } catch (error) {
            console.error('Lỗi đăng bài:', error);
            res.status(500).send('Lỗi máy chủ');
        }
};

//xoa bai viet
export const deletePost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }

        const postId = req.params.postId;
        const userId = req.user._id;

        // Tìm bài viết
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        // Kiểm tra quyền xóa (chỉ tác giả mới được xóa)
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bài viết này" });
        }

        // Xóa bài viết
        await Post.findByIdAndDelete(postId);

        // Xóa các bình luận liên quan (nếu cần)
        //await Comment.deleteMany({ post: postId });

        res.json({
            success: true,
            message: "Xóa bài viết thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

// like bai viet
export const likePost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }

        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        // Kiểm tra xem user đã like chưa
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Nếu đã like, xóa like
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            // Nếu chưa like, thêm like
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            success: true,
            likesCount: post.likes.length,
            hasLiked: !hasLiked // Trả về trạng thái mới
        });
    } catch (error) {
        console.error("Lỗi khi like bài viết:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};



//edit bai viet
export const editPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }

        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        // Kiểm tra quyền xóa (chỉ tác giả mới được xóa)
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền sửa bài viết này" });
        }

        const { caption, desc } = req.body;

        post.caption = caption;
        post.desc = desc;

        await post.save();

        res.json({
            success: true,
            message: "Sửa bài viết thanh cong"
        });        
    } catch (error) {
        console.error("Lỗi khi sửa bài viết:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }   
};