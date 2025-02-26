import express from 'express';
import { getCommunity } from '../controller/community.controller.js';
import { auth } from '../middleware/auth.js'; 
import { requireAuth } from "../middleware/auth.js";
import multer from 'multer';
import Post from "../models/post.model.js";  

const router = express.Router();
//router.get('/community', auth, getCommunity);
router.get('/community', requireAuth, getCommunity);

// Luu anh
const storage = multer.diskStorage({
    destination: './public/uploads', 
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

//API/POST - Đăng bài viết
router.post('/community/create-post', requireAuth, upload.single('img'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }

        const { caption, desc } = req.body;
        const img = req.file ? `/uploads/${req.file.filename}` : null;

        const newPost = new Post({
            caption,
            desc,
            img,
            author: req.user._id, 
        });

        await newPost.save();
        res.redirect('/community');
    } catch (error) {
        console.error('Lỗi đăng bài:', error);
        res.status(500).send('Lỗi máy chủ');
    }
});

// API / POST - Sửa bài viết
// router.post("/edit/:id", async (req, res) => {
//     try {
//         const { caption, desc } = req.body;
//         await Post.findByIdAndUpdate(req.params.id, { caption, desc });
//         res.redirect("/community"); 
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Lỗi cập nhật bài viết");
//     }
// });


// // Cấu hình hiển thị ảnh tĩnh (Next.js hoặc Express)
// router.use('/uploads', express.static('public/uploads'));


export default router;