import User from '../models/user.model.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Course from '../models/course.model.js';
import Lesson from '../models/lesson.model.js';
import { getReciverSocketIds, io } from "../socket/socket.js";

// import getDatUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";

// [GET] get register page
export const getRegister = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode) {
            req.flash('error', 'Bạn cần đăng xuất ');
            res.redirect('/');
            return;
        }
    }

    res.render('./page/auth/login', {
        title: 'Đăng ký',
    });
};
//[POST]
export const postRegister = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        if (!username || !email || !password || !fullname) {
            req.flash('error', 'Vui lòng điền đầy đủ thông tin!');
            return res.redirect('/register');
        }
        const regexUsername = /^[a-zA-Z0-9_]+$/;
        const regexEmail = /^\S+@\S+\.\S+$/;

        if (!regexUsername.test(username)) {
            req.flash('error', 'Tên người dùng không hợp lệ!');
            return res.redirect('/register');
        }

        if (!regexEmail.test(email)) {
            req.flash('error', 'Email không hợp lệ!');
            return res.redirect('/register');
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            req.flash('error', 'Email hoặc tên người dùng đã tồn tại!');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({ fullname, username, email, password: hashedPassword });

        req.flash('success', 'Đăng ký thành công! Hãy đăng nhập.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng ký.');
        res.redirect('/register');
    }
};

export const verifyOtpForRegistration = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            req.flash('error', 'Vui lòng cung cấp email và OTP!');
            return res.redirect('/verify-otp');
        }

        const isOtpValid = await verifyOtp(email, otp);
        if (!isOtpValid) {
            req.flash('error', 'OTP không hợp lệ!');
            return res.redirect('/verify-otp');
        }

        req.flash('success', 'OTP hợp lệ! Bạn có thể tiếp tục.');
        res.redirect('/auth/register');
    } catch (error) {
        console.error('Error verifying OTP:', error);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình xác thực OTP.');
        res.redirect('/verify-otp');
    }
};
//[GET] get login page
export const getLogin = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode) {
            req.flash('success', 'Bạn đã đăng nhập trước đó! ');
            console.log('decode', decode);
            res.redirect('/');
            return;
        }
    }

    res.render('./page/auth/login', {
        title: 'Đăng nhập',
    });
};
//[POST] /api/user/login
export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            req.flash('error', 'Vui lòng điền đầy đủ thông tin!');
            return res.redirect('/login');
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash('error', 'Email hoặc mật khẩu không đúng!');
            return res.redirect('/login');
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 5 * 60 * 60 * 1000, // 5 giờ
        });

        res.locals.user = user;
        req.flash('success', 'Đăng nhập thành công!');
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng nhập.');
        res.redirect('/login');
    }
};

//[GET] /api/user/logout
export const getLogout = async (req, res) => {
    try {
        res.clearCookie('token');
        req.flash('success', 'Đăng xuất thành công!');
        res.redirect('/');
    } catch (error) {
        console.error('Error during logout:', error);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình đăng xuất.');
        res.redirect('/');
    }
};
//home
export const getHome = async (req, res) => {
    if (res.locals.user) {
        const allUsers = await User.find({ _id: { $ne: res.locals.user._id } }).select('-password');
        res.render('./page/home/home', {
            title: 'Trang chủ',
            allUsers: allUsers,
        });
        return;
    }
    res.render('./page/home/home', {
        title: 'Trang chủ',
    });




};


export const addCourses = async (req, res) => {
    try {
        // const user = res.locals.user;  // Lấy người dùng hiện tại
        // // Tạo khóa học mới với tên duy nhất
        // const khoaHoc = await Course.create({
        //     name: 'Khoa hoc ' + Date.now(),  // Thêm thời gian vào tên khóa học để đảm bảo tính duy nhất
        //     instructor: user._id,   // Giảng viên là user hiện tại
        //     language: 'Vietnamese',
        //     description: 'Mô tả khóa học',
        //     price: 200000
        // });
        // console.log('khoaHoc:', khoaHoc);

        // // Tạo 30 bài học và thêm vào khóa học
        // for (let i = 1; i <= 30; i++) {
        //     const baiHoc = await Lesson.create({
        //         title: `Bai hoc ${i}`,    // Tiêu đề bài học
        //         type: i % 2 === 0 ? 'video' : 'task',   // Giả sử bài học video và bài tập xen kẽ
        //         content: `Nội dung của bài học ${i}`,
        //         videoUrl: i % 2 === 0 ? `https://video.com/bai-hoc-${i}` : null,  // URL video cho bài học video
        //         jsonTask: i % 2 !== 0 ? `{"task": "Mô tả bài tập ${i}"}` : null  // JSON task cho bài học bài tập
        //     });

        //     // Thêm bài học vào mảng lessons của khóa học
        //     khoaHoc.lessons.push(baiHoc._id);
        // }

        // // Lưu lại khóa học với các bài học đã được thêm
        // await khoaHoc.save();
        const x = await Course.findOne({ name: 'Khoa hoc 1739866050679' }).populate('lessons');
        console.log('x:', x);
        req.flash('success', 'Khóa học đã được thêm thành công!');
        res.redirect('/');
    } catch (error) {
        console.error('Error during addCourses:', error);
        req.flash('error', 'Đã xảy ra lỗi trong quá trình thêm khóa học.');
        res.redirect('/');
    }
};



