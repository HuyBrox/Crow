import mongoose from "mongoose";
import User from "../models/user.model.js";
import { getReciverSocketIds, io } from "../socket/socket.js";

export const callPage = async (req, res) => {
    try {
        const user = res.locals.user;
        const receiverId = req.query.receiverId;
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            req.flash('error', 'Người dùng không tồn tại');
            return res.redirect('/');
        }
        const receiverSocketIds = getReciverSocketIds(receiverId);
        if (!receiverSocketIds) {
            req.flash('error', 'Người dùng không online');
            return res.redirect('/');
        }
        res.render('./page/call/call', {
            title: 'Đang gọi cho ' + receiver.username,
            user,
            receiver
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Lỗi khi thiết lập cuộc gọi');
        return res.redirect('/');
    }
};
